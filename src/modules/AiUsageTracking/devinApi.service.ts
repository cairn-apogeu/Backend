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

interface SyncResult {
  sessions_found: number;
  prompts_imported: number;
  sessions: Array<{
    session_id: string;
    status: string;
    created_at: string;
    acus_consumed: number;
    user_prompts: Array<{
      message: string;
      created_at: string;
    }>;
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

  async syncSessions(
    apiKey: string,
    orgId: string,
    options?: { limit?: number; createdAfter?: number; createdBefore?: number }
  ): Promise<SyncResult> {
    const sessions = await this.listSessions(apiKey, orgId, options);

    const result: SyncResult = {
      sessions_found: sessions.length,
      prompts_imported: 0,
      sessions: [],
    };

    for (const session of sessions) {
      try {
        const messages = await this.getSessionMessages(
          apiKey,
          orgId,
          session.session_id
        );

        const userPrompts = messages
          .filter((m) => m.source === "user")
          .map((m) => ({
            message: m.message,
            created_at: new Date(m.created_at * 1000).toISOString(),
          }));

        result.prompts_imported += userPrompts.length;

        result.sessions.push({
          session_id: session.session_id,
          status: session.status,
          created_at: new Date(session.created_at * 1000).toISOString(),
          acus_consumed: session.acus_consumed,
          user_prompts: userPrompts,
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
          acus_consumed: session.acus_consumed,
          user_prompts: [],
        });
      }
    }

    return result;
  }
}

export default new DevinApiService();
