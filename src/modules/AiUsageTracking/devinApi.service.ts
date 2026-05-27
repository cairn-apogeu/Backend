import axios, { AxiosError } from "axios";

const DEVIN_API_BASE = "https://api.devin.ai/v3";

interface DevinSessionMessage {
  event_id: string;
  source: "devin" | "user";
  message: string;
  created_at: number;
}

interface DevinSessionInsight {
  session_id: string;
  status: string;
  created_at: number;
  acus_consumed: number;
  num_user_messages: number;
  num_devin_messages: number;
  origin: string | null;
  pull_requests: Array<{
    url?: string;
    title?: string;
    status?: string;
  }>;
}

interface DevinConsumptionResponse {
  total_acus: number;
  consumption_by_date: Array<{
    date: number;
    acus: number;
    acus_by_product: {
      devin: number;
      cascade: number;
      terminal: number;
    };
  }>;
}

interface PromptResponsePair {
  prompt: string;
  prompt_created_at: string;
  devin_response: string;
  acu_cost: number | null;
}

interface SyncResult {
  sessions_found: number;
  total_interactions: number;
  sessions: Array<{
    session_id: string;
    status: string;
    created_at: string;
    total_acus: number;
    interactions: PromptResponsePair[];
  }>;
}

class DevinApiService {
  private getHeaders(apiKey: string) {
    return {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async listSessions(
    apiKey: string,
    orgId: string,
    options?: { limit?: number; createdAfter?: number; createdBefore?: number }
  ): Promise<DevinSessionInsight[]> {
    const limit = options?.limit ?? 50;
    const params: Record<string, string | number> = {
      "qs[first]": limit,
    };
    if (options?.createdAfter) {
      params["qs[created_after]"] = options.createdAfter;
    }
    if (options?.createdBefore) {
      params["qs[created_before]"] = options.createdBefore;
    }

    const response = await axios.get(
      `${DEVIN_API_BASE}/organizations/${orgId}/sessions/insights`,
      {
        headers: this.getHeaders(apiKey),
        params,
      }
    );

    return response.data.items || [];
  }

  async getSessionMessages(
    apiKey: string,
    orgId: string,
    sessionId: string
  ): Promise<DevinSessionMessage[]> {
    const allMessages: DevinSessionMessage[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const params: Record<string, string | number> = { first: 200 };
      if (cursor) params.after = cursor;

      const response = await axios.get(
        `${DEVIN_API_BASE}/organizations/${orgId}/sessions/${sessionId}/messages`,
        {
          headers: this.getHeaders(apiKey),
          params,
        }
      );

      const items: DevinSessionMessage[] = response.data.items || [];
      allMessages.push(...items);
      cursor = response.data.end_cursor;
      hasMore = response.data.has_next_page && !!cursor;
    }

    return allMessages;
  }

  async getSessionConsumption(
    apiKey: string,
    orgId: string,
    sessionId: string
  ): Promise<DevinConsumptionResponse> {
    const response = await axios.get(
      `${DEVIN_API_BASE}/organizations/${orgId}/consumption/daily/sessions/${sessionId}`,
      {
        headers: this.getHeaders(apiKey),
      }
    );

    return response.data;
  }

  pairPromptsWithResponses(
    messages: DevinSessionMessage[],
    totalAcus: number
  ): PromptResponsePair[] {
    const sorted = [...messages].sort((a, b) => a.created_at - b.created_at);
    const pairs: PromptResponsePair[] = [];

    let i = 0;
    while (i < sorted.length) {
      if (sorted[i].source === "user") {
        const userMsg = sorted[i];
        const responseTexts: string[] = [];
        let j = i + 1;

        while (j < sorted.length && sorted[j].source === "devin") {
          responseTexts.push(sorted[j].message);
          j++;
        }

        pairs.push({
          prompt: userMsg.message,
          prompt_created_at: new Date(userMsg.created_at * 1000).toISOString(),
          devin_response: responseTexts.join("\n\n---\n\n"),
          acu_cost: null,
        });

        i = j;
      } else {
        i++;
      }
    }

    if (pairs.length > 0 && totalAcus > 0) {
      const costPerInteraction = totalAcus / pairs.length;
      for (const pair of pairs) {
        pair.acu_cost = Math.round(costPerInteraction * 100) / 100;
      }
    }

    return pairs;
  }

  async syncSessions(
    apiKey: string,
    orgId: string,
    options?: { limit?: number; createdAfter?: number; createdBefore?: number }
  ): Promise<SyncResult> {
    const sessions = await this.listSessions(apiKey, orgId, options);

    const result: SyncResult = {
      sessions_found: sessions.length,
      total_interactions: 0,
      sessions: [],
    };

    for (const session of sessions) {
      try {
        const messages = await this.getSessionMessages(
          apiKey,
          orgId,
          session.session_id
        );

        const interactions = this.pairPromptsWithResponses(
          messages,
          session.acus_consumed
        );

        result.total_interactions += interactions.length;

        result.sessions.push({
          session_id: session.session_id,
          status: session.status,
          created_at: new Date(session.created_at * 1000).toISOString(),
          total_acus: session.acus_consumed,
          interactions,
        });
      } catch (error) {
        const axiosErr = error as AxiosError;
        console.error(
          `Error fetching messages for session ${session.session_id}:`,
          axiosErr.message
        );
        result.sessions.push({
          session_id: session.session_id,
          status: session.status,
          created_at: new Date(session.created_at * 1000).toISOString(),
          total_acus: session.acus_consumed,
          interactions: [],
        });
      }
    }

    return result;
  }
}

export default new DevinApiService();
