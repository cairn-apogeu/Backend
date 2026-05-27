import { FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";
import aiUsageTrackingService from "./aiUsageTracking.service";
import devinApiService from "./devinApi.service";
import { CreateTrackingSchema } from "./schemas/create-tracking.schema";
import { UpdateTrackingSchema } from "./schemas/update-tracking.schema";
import { SyncDevinSessionsSchema } from "./schemas/sync-devin-sessions.schema";
import { ImportDevinPromptsSchema } from "./schemas/import-devin-prompts.schema";

class AiUsageTrackingController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const dto = CreateTrackingSchema.parse(request.body);
      const record = await aiUsageTrackingService.create(userId, dto);
      reply.code(201).send(record);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        return reply.code(400).send({ error: "Dados inválidos", details: error });
      }
      console.error("Erro ao criar tracking:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }

  async findByUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const records = await aiUsageTrackingService.findByUser(userId);
      reply.send(records);
    } catch (error: unknown) {
      console.error("Erro ao buscar tracking:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const { id } = request.params;
      const record = await aiUsageTrackingService.findById(id, userId);
      reply.send(record);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "Acesso não autorizado"
      ) {
        return reply.code(403).send({ error: "Acesso não autorizado" });
      }
      console.error("Erro ao buscar tracking por ID:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }

  async update(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const { id } = request.params;
      const dto = UpdateTrackingSchema.parse(request.body);
      const record = await aiUsageTrackingService.update(id, userId, dto);
      reply.send(record);
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "Acesso não autorizado"
      ) {
        return reply.code(403).send({ error: "Acesso não autorizado" });
      }
      console.error("Erro ao atualizar tracking:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  }

  async syncDevinSessions(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const body = SyncDevinSessionsSchema.parse(request.body);
      const result = await devinApiService.syncSessions(
        body.devin_api_key,
        body.devin_org_id,
        {
          limit: body.limit,
          createdAfter: body.created_after,
          createdBefore: body.created_before,
        }
      );
      reply.send(result);
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        return reply.code(400).send({ error: "Dados inválidos", details: error });
      }
      console.error("Erro ao sincronizar sessões Devin:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro ao conectar com API do Devin",
      });
    }
  }

  async importDevinPrompts(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const body = ImportDevinPromptsSchema.parse(request.body);
      const messages = await devinApiService.getSessionMessages(
        body.devin_api_key,
        body.devin_org_id,
        body.session_id
      );

      let totalAcus = body.acus_consumed ?? 0;

      if (totalAcus === 0) {
        try {
          const consumption = await devinApiService.getSessionConsumption(
            body.devin_api_key,
            body.devin_org_id,
            body.session_id
          );
          totalAcus = consumption.total_acus ?? 0;
        } catch (consumptionError) {
          console.warn("Não foi possível obter consumo de ACUs automaticamente:", consumptionError);
        }
      }

      const interactions = devinApiService.pairPromptsWithResponses(messages, totalAcus);

      const imported: Array<{
        id: string;
        prompt: string;
        devin_response: string;
        acu_cost: number | null;
        created_at: Date;
      }> = [];

      for (const interaction of interactions) {
        const record = await aiUsageTrackingService.create(userId, {
          prompt: interaction.prompt,
          devin_response: interaction.devin_response || null,
          devin_session_id: body.session_id,
          acu_consumption_after_response: interaction.acu_cost,
        });
        imported.push({
          id: record.id,
          prompt: interaction.prompt,
          devin_response: interaction.devin_response,
          acu_cost: interaction.acu_cost,
          created_at: record.created_at,
        });
      }

      reply.code(201).send({
        session_id: body.session_id,
        total_acus: totalAcus,
        interactions_imported: imported.length,
        records: imported,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        return reply.code(400).send({ error: "Dados inválidos", details: error });
      }
      console.error("Erro ao importar prompts do Devin:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro ao importar prompts",
      });
    }
  }
  async importAllDevinSessions(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return reply.code(401).send({ error: "Usuário não autenticado" });
      }

      const body = SyncDevinSessionsSchema.parse(request.body);
      const syncResult = await devinApiService.syncSessions(
        body.devin_api_key,
        body.devin_org_id,
        {
          limit: body.limit,
          createdAfter: body.created_after,
          createdBefore: body.created_before,
        }
      );

      const existingRecords = await aiUsageTrackingService.findByUser(userId);
      const existingSessionIds = new Set(
        existingRecords
          .filter((r) => r.devin_session_id)
          .map((r) => r.devin_session_id)
      );

      let totalImported = 0;
      let totalAcusImported = 0;
      const sessionResults: Array<{
        session_id: string;
        interactions_imported: number;
        total_acus: number;
        skipped: boolean;
      }> = [];

      for (const session of syncResult.sessions) {
        if (existingSessionIds.has(session.session_id)) {
          sessionResults.push({
            session_id: session.session_id,
            interactions_imported: 0,
            total_acus: session.total_acus,
            skipped: true,
          });
          continue;
        }

        let sessionAcus = session.total_acus;
        if (sessionAcus === 0) {
          try {
            const consumption = await devinApiService.getSessionConsumption(
              body.devin_api_key,
              body.devin_org_id,
              session.session_id
            );
            sessionAcus = consumption.total_acus ?? 0;
          } catch {
            // Use 0 if consumption fetch fails
          }
        }

        for (const interaction of session.interactions) {
          const acuCost = session.interactions.length > 0 && sessionAcus > 0
            ? Math.round((sessionAcus / session.interactions.length) * 100) / 100
            : null;

          await aiUsageTrackingService.create(userId, {
            prompt: interaction.prompt,
            devin_response: interaction.devin_response || null,
            devin_session_id: session.session_id,
            acu_consumption_after_response: acuCost,
          });
          totalImported++;
        }

        totalAcusImported += sessionAcus;
        sessionResults.push({
          session_id: session.session_id,
          interactions_imported: session.interactions.length,
          total_acus: sessionAcus,
          skipped: false,
        });
      }

      reply.code(201).send({
        sessions_processed: syncResult.sessions_found,
        sessions_skipped: sessionResults.filter((s) => s.skipped).length,
        total_interactions_imported: totalImported,
        total_acus: totalAcusImported,
        sessions: sessionResults,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "ZodError") {
        return reply.code(400).send({ error: "Dados inválidos", details: error });
      }
      console.error("Erro ao importar todas as sessões Devin:", error);
      reply.code(500).send({
        error: error instanceof Error ? error.message : "Erro ao importar sessões",
      });
    }
  }
}

export default new AiUsageTrackingController();
