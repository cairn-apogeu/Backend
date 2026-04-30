import "dotenv/config";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import { Status } from "@prisma/client";
import prisma from "../src/clients/prisma.client";

const STUDENTS_PER_PROJECT = 6;
const CARDS_PER_SPRINT = 8;
const DEFAULT_PASSWORD = "ApogeuSeed!123";
const SEED_LABEL = "Seed";
const BASE_YEAR = 2024;

type SeedRole = "Mentor" | "Cliente" | "Dev" | "RH";

type SeededUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: SeedRole;
};

type ProjectBlueprint = {
  name: string;
  status: string;
  sprintCount: number;
  computedSprints: number;
  startMonth: number;
  durationMonths: number;
};

const PROJECT_BLUEPRINTS: ProjectBlueprint[] = [
  {
    name: `${SEED_LABEL} Squad Onboarding CRM`,
    status: "Finalizado",
    sprintCount: 4,
    computedSprints: 4,
    startMonth: 0,
    durationMonths: 5,
  },
  {
    name: `${SEED_LABEL} Portal do Cliente`,
    status: "Finalizado",
    sprintCount: 5,
    computedSprints: 5,
    startMonth: 2,
    durationMonths: 6,
  },
  {
    name: `${SEED_LABEL} Ferramenta de Suporte`,
    status: "Em andamento",
    sprintCount: 4,
    computedSprints: 3,
    startMonth: 5,
    durationMonths: 5,
  },
];

const difficultyPool = [
  "MUITO_FACIL",
  "FACIL",
  "MEDIO",
  "DIFICIL",
  "MUITO_DIFICIL",
] as const;

const xpMap = {
  MUITO_FACIL: 10,
  FACIL: 20,
  MEDIO: 30,
  DIFICIL: 40,
  MUITO_DIFICIL: 50,
} as const;

const xpFields = [
  "xp_frontend",
  "xp_backend",
  "xp_negocios",
  "xp_arquitetura",
  "xp_design",
  "xp_data_analysis",
] as const;

const MATURITY_GROWTH_FACTOR = 1.3;
const MATURITY_VALIDATION_TOLERANCE = 1e-6;
const GOOD_CASE_START_PATTERN = [3, 3, 3, 3, 4, 4] as const;
const GOOD_CASE_TARGET_LAST_THROUGHPUT = 4032;
const GOOD_CASE_THROUGHPUT_GROWTH = 1.3;
const GOOD_CASE_GROWTH_TOLERANCE = 0.001;
const GOOD_CASE_LAST_DELTA_NEAR_ZERO_MAX = 2;
const GOOD_CASE_START_DELTA_RATIO = 0.18;
const GOOD_CASE_END_DELTA_RATIO = 0.002;
const GOOD_CASE_BLUEPRINT_NAME = `${SEED_LABEL} Portal do Cliente`;

const capacidadeFields = [
  "reformulacao_problema",
  "separacao_sintoma_causa",
  "autocritica_tecnica",
  "escolha_abordagens_tecnicas",
] as const;

const comunicacaoFields = [
  "validacao_entendimento_pre_execucao",
  "clareza_exposicao_tecnica",
  "participacao_discussoes_tecnicas",
  "sinalizacao_desalinhamento_ruido",
] as const;

const execucaoFields = [
  "delta_time_predict",
  "reestimativa_ativa",
  "estabilidade_throughput",
  "sinalizacao_bloqueios",
  "qualidade_cards_dor",
  "aderencia_entregas_dod",
] as const;

const contribuicaoFields = [
  "ajudas_prestadas",
  "sinalizacao_risco_tecnico_integracao",
  "compartilhamento_solucoes",
  "participacao_feedbacks",
] as const;

const maturityFields = [
  ...capacidadeFields,
  ...comunicacaoFields,
  ...execucaoFields,
  ...contribuicaoFields,
] as const;

type MaturityTrendMode = "default" | "good_case_30pct";

type StatsAccumulator = {
  xp_frontend: number;
  xp_backend: number;
  xp_negocios: number;
  xp_arquitetura: number;
  xp_design: number;
  xp_data_analysis: number;
  total_throughput: number;
  average_daily: number;
  deltatime_predict: number;
  hasDelta: boolean;
};

type MaturityField = (typeof maturityFields)[number];

type MaturityValueRange = {
  start: number;
  end: number;
};

type GoodCaseMaturityPlan = Record<
  MaturityField,
  Record<string, MaturityValueRange>
>;

type GoodCaseValidationTracker = {
  projectName: string;
  perFieldSprintAverages: Record<MaturityField, number[]>;
  sprintThroughputTotals: number[];
  sprintTempoDeltaAbsAverages: number[];
};

type GoodCaseThroughputPlan = {
  throughputTargets: number[];
  deltaRatios: number[];
};

type CardTimingOverride = {
  tempo: number;
  tempoEstimado: number;
};

const clerkSecret = process.env.CLERK_SECRET_KEY;
if (!clerkSecret) {
  throw new Error("CLERK_SECRET_KEY não definido. Configure o .env antes de rodar o seed.");
}

const clerk = createClerkClient({ secretKey: clerkSecret });

type CardCreateInput = Parameters<typeof prisma.cards.create>[0]["data"];

type ProgressionCreateInput = Parameters<
  typeof prisma.cardProgression.createMany
>[0]["data"][number];

type CapacidadeCreateInput = Parameters<
  typeof prisma.capacidadeCognitivaAplicada.createMany
>[0]["data"][number];

type ComunicacaoCreateInput = Parameters<
  typeof prisma.comunicacaoOperacional.createMany
>[0]["data"][number];

type ExecucaoCreateInput = Parameters<
  typeof prisma.execucaoConfiavel.createMany
>[0]["data"][number];

type ContribuicaoCreateInput = Parameters<
  typeof prisma.contribuicaoSistemica.createMany
>[0]["data"][number];

function addDays(base: Date, days: number) {
  const result = new Date(base.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(base: Date, months: number) {
  const result = new Date(base.getTime());
  result.setMonth(result.getMonth() + months);
  return result;
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function juniorScore(max = 4) {
  return Math.max(1, Math.min(max, Math.round(1 + Math.random() * 3)));
}

function realisticTempo(estimated: number, completed: boolean) {
  if (completed) {
    return Math.max(estimated, estimated + Math.floor(Math.random() * 2) - 1);
  }
  return estimated + Math.floor(Math.random() * 3);
}

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function createGoodCaseMaturityPlan(userIds: string[]): GoodCaseMaturityPlan {
  if (userIds.length !== GOOD_CASE_START_PATTERN.length) {
    throw new Error(
      `Good case requer ${GOOD_CASE_START_PATTERN.length} devs, recebido: ${userIds.length}`
    );
  }

  const plan = {} as GoodCaseMaturityPlan;
  for (const field of maturityFields) {
    const starts = shuffleArray([...GOOD_CASE_START_PATTERN]);
    const byUser: Record<string, MaturityValueRange> = {};
    for (let i = 0; i < userIds.length; i++) {
      const start = starts[i];
      byUser[userIds[i]] = {
        start,
        end: start + 1,
      };
    }
    plan[field] = byUser;
  }
  return plan;
}

function createGoodCaseValidationTracker(projectName: string): GoodCaseValidationTracker {
  return {
    projectName,
    perFieldSprintAverages: Object.fromEntries(
      maturityFields.map((field) => [field, []])
    ) as Record<MaturityField, number[]>,
    sprintThroughputTotals: [],
    sprintTempoDeltaAbsAverages: [],
  };
}

function createGoodCaseThroughputPlan(sprintCount: number): GoodCaseThroughputPlan {
  if (sprintCount < 2) {
    throw new Error("Good case requer ao menos 2 sprints para validação de evolução.");
  }

  const firstThroughput = Math.round(
    GOOD_CASE_TARGET_LAST_THROUGHPUT / GOOD_CASE_THROUGHPUT_GROWTH
  );

  const throughputTargets = Array.from({ length: sprintCount }, (_, index) => {
    if (index === 0) return firstThroughput;
    if (index === sprintCount - 1) return GOOD_CASE_TARGET_LAST_THROUGHPUT;
    const progress = index / (sprintCount - 1);
    return Math.round(
      firstThroughput +
        (GOOD_CASE_TARGET_LAST_THROUGHPUT - firstThroughput) * progress
    );
  });

  for (let i = 1; i < throughputTargets.length - 1; i++) {
    throughputTargets[i] = Math.max(throughputTargets[i], throughputTargets[i - 1] + 1);
  }

  throughputTargets[throughputTargets.length - 1] = GOOD_CASE_TARGET_LAST_THROUGHPUT;

  for (let i = throughputTargets.length - 2; i >= 0; i--) {
    throughputTargets[i] = Math.min(throughputTargets[i], throughputTargets[i + 1] - 1);
  }

  const deltaRatios = Array.from({ length: sprintCount }, (_, index) => {
    if (index === sprintCount - 1) return GOOD_CASE_END_DELTA_RATIO;
    const progress = index / (sprintCount - 1);
    return (
      GOOD_CASE_START_DELTA_RATIO +
      (GOOD_CASE_END_DELTA_RATIO - GOOD_CASE_START_DELTA_RATIO) * progress
    );
  });

  return { throughputTargets, deltaRatios };
}

function createGoodCaseCardTimings(params: {
  sprintNumber: number;
  sprintCount: number;
  cardCount: number;
  throughputTarget: number;
  deltaRatio: number;
}): CardTimingOverride[] {
  const { sprintNumber, sprintCount, cardCount, throughputTarget, deltaRatio } = params;
  const base = Math.floor(throughputTarget / cardCount);
  const offsetsTemplate = [-24, -16, -8, -4, 4, 8, 16, 24];
  const offsets = Array.from({ length: cardCount }, (_, index) => {
    return offsetsTemplate[(index + sprintNumber - 1) % offsetsTemplate.length] ?? 0;
  });

  const tempos = offsets.map((offset) => Math.max(1, base + offset));
  let missing = throughputTarget - tempos.reduce((sum, value) => sum + value, 0);
  let cursor = 0;

  while (missing !== 0) {
    const idx = (cursor + sprintNumber) % cardCount;
    if (missing > 0) {
      tempos[idx] += 1;
      missing -= 1;
    } else if (tempos[idx] > 1) {
      tempos[idx] -= 1;
      missing += 1;
    }
    cursor += 1;
    if (cursor > 10_000) {
      throw new Error("Falha ao distribuir throughput do good case.");
    }
  }

  const deltaPattern = [1.12, 0.9, 1.05, 0.95, 1.0, 1.08, 0.92, 1.0];
  return tempos.map((tempo, index) => {
    const minDiff = sprintNumber === sprintCount ? 0 : 1;
    const diff = Math.max(
      minDiff,
      Math.round(tempo * deltaRatio * (deltaPattern[index % deltaPattern.length] ?? 1))
    );
    const tempoEstimado = Math.max(1, tempo - diff);
    return { tempo, tempoEstimado };
  });
}

function computeGoodCaseAttributeValue(params: {
  userId: string;
  field: MaturityField;
  sprintNumber: number;
  sprintCount: number;
  plan: GoodCaseMaturityPlan;
}) {
  const { userId, field, sprintNumber, sprintCount, plan } = params;
  const userPlan = plan[field][userId];
  if (!userPlan) {
    throw new Error(`Plano de maturidade ausente para ${field} do usuário ${userId}`);
  }

  if (sprintCount <= 1) return userPlan.end;

  const progress = (sprintNumber - 1) / (sprintCount - 1);
  const rawValue = userPlan.start + (userPlan.end - userPlan.start) * progress;
  return Math.round(rawValue);
}

function validateGoodCaseMaturityTrend(params: {
  projectName: string;
  sprintCount: number;
  tracker: GoodCaseValidationTracker;
}) {
  const { projectName, sprintCount, tracker } = params;

  for (const field of maturityFields) {
    const values = tracker.perFieldSprintAverages[field];
    if (values.length !== sprintCount) {
      throw new Error(
        `[Good Case] ${projectName} inválido em ${field}: esperado ${sprintCount} sprints, obtido ${values.length}.`
      );
    }

    for (let i = 1; i < values.length; i++) {
      if (values[i] + MATURITY_VALIDATION_TOLERANCE < values[i - 1]) {
        throw new Error(
          `[Good Case] ${projectName} sem progressão monotônica em ${field}: sprint ${
            i
          }=${values[i - 1].toFixed(4)} -> sprint ${i + 1}=${values[i].toFixed(4)}`
        );
      }
    }

    const first = values[0];
    const last = values[values.length - 1];
    const expected = first * MATURITY_GROWTH_FACTOR;
    if (Math.abs(last - expected) > MATURITY_VALIDATION_TOLERANCE) {
      throw new Error(
        `[Good Case] ${projectName} sem +30% em ${field}: primeira=${first.toFixed(
          4
        )}, última=${last.toFixed(4)}, esperado=${expected.toFixed(4)}`
      );
    }
  }
}

function validateGoodCaseThroughputTrend(params: {
  projectName: string;
  sprintCount: number;
  tracker: GoodCaseValidationTracker;
}) {
  const { projectName, sprintCount, tracker } = params;
  const throughputs = tracker.sprintThroughputTotals;
  const deltaAverages = tracker.sprintTempoDeltaAbsAverages;

  if (throughputs.length !== sprintCount) {
    throw new Error(
      `[Good Case] ${projectName} inválido em throughput: esperado ${sprintCount} sprints, obtido ${throughputs.length}.`
    );
  }

  if (deltaAverages.length !== sprintCount) {
    throw new Error(
      `[Good Case] ${projectName} inválido em delta médio: esperado ${sprintCount} sprints, obtido ${deltaAverages.length}.`
    );
  }

  for (let i = 1; i < throughputs.length; i++) {
    if (throughputs[i] <= throughputs[i - 1]) {
      throw new Error(
        `[Good Case] ${projectName} sem crescimento de throughput: sprint ${
          i
        }=${throughputs[i - 1]} -> sprint ${i + 1}=${throughputs[i]}`
      );
    }
  }

  const firstThroughput = throughputs[0];
  const lastThroughput = throughputs[throughputs.length - 1];
  if (lastThroughput !== GOOD_CASE_TARGET_LAST_THROUGHPUT) {
    throw new Error(
      `[Good Case] ${projectName} com throughput final inválido: esperado ${GOOD_CASE_TARGET_LAST_THROUGHPUT}, obtido ${lastThroughput}.`
    );
  }

  const growthRatio = lastThroughput / firstThroughput;
  if (Math.abs(growthRatio - GOOD_CASE_THROUGHPUT_GROWTH) > GOOD_CASE_GROWTH_TOLERANCE) {
    throw new Error(
      `[Good Case] ${projectName} sem crescimento ~30% no throughput: primeira=${firstThroughput}, última=${lastThroughput}, razão=${growthRatio.toFixed(
        6
      )}`
    );
  }

  for (let i = 1; i < deltaAverages.length; i++) {
    if (deltaAverages[i] > deltaAverages[i - 1] + MATURITY_VALIDATION_TOLERANCE) {
      throw new Error(
        `[Good Case] ${projectName} sem redução de |tempo-tempo_estimado|: sprint ${
          i
        }=${deltaAverages[i - 1].toFixed(4)} -> sprint ${i + 1}=${deltaAverages[
          i
        ].toFixed(4)}`
      );
    }
  }

  const lastDelta = deltaAverages[deltaAverages.length - 1];
  if (lastDelta > GOOD_CASE_LAST_DELTA_NEAR_ZERO_MAX) {
    throw new Error(
      `[Good Case] ${projectName} com delta final acima do limite: ${
        lastDelta.toFixed(4)
      } > ${GOOD_CASE_LAST_DELTA_NEAR_ZERO_MAX}`
    );
  }
}

async function ensureClerkUser(role: SeedRole, index: number): Promise<SeededUser> {
  const firstName = `${role} ${index + 1}`;
  const lastName = "Seed";
  const email = `${SEED_LABEL.toLowerCase()}-${role.toLowerCase()}-${index + 1}@apogeu.dev`;
  const username = `${SEED_LABEL.toLowerCase()}_${role.toLowerCase()}_${index + 1}`
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 32);

  const existing = await clerk.users.getUserList({
    emailAddress: [email],
    limit: 1,
  });

  if (existing.length > 0) {
    const user = existing[0];
    try {
      await clerk.users.updateUser(user.id, {
        username,
        publicMetadata: { tipo_perfil: role },
      });
    } catch (error) {
      console.warn(`Não foi possível atualizar metadata para ${user.id}`, error);
    }
    return { id: user.id, email, firstName, lastName, role };
  }

  const user = await clerk.users.createUser({
    emailAddress: [email],
    password: DEFAULT_PASSWORD,
    firstName,
    lastName,
    username,
    publicMetadata: { tipo_perfil: role },
  });

  return { id: user.id, email, firstName, lastName, role };
}

async function provisionRoleUsers(role: SeedRole, total: number) {
  const results: SeededUser[] = [];
  for (let i = 0; i < total; i++) {
    const user = await ensureClerkUser(role, i);
    results.push(user);
  }
  return results;
}

async function upsertLocalUsers(users: SeededUser[]) {
  const payload = users.map((user) => {
    const isDev = user.role === "Dev";
    return {
      user_clerk_id: user.id,
      tipo_perfil: user.role,
      discord: `${user.role.toLowerCase()}${user.id.slice(-4)}`.slice(0, 20),
      linkedin: `linkedin.com/in/${user.firstName.toLowerCase().replace(/\s/g, "")}-${user.id.slice(-4)}`.slice(0, 30),
      github: `${user.firstName.toLowerCase().replace(/\s/g, "")}-junior`.slice(0, 30),
      objetivo_curto: isDev
        ? "Concluir features com acompanhamento do mentor"
        : "Suportar squads de formação",
      objetivo_medio: isDev
        ? "Ganhar autonomia em revisões e refinamentos"
        : "Evoluir processos do programa",
      objetivo_longo: isDev
        ? "Tornar-se dev pleno em 18 meses"
        : "Escalar novos squads juniores",
      genero: "ND",
      nascimento: new Date("1999-01-01"),
      biografia: `${user.firstName} faz parte do ${SEED_LABEL} e atua como ${user.role}.`,
    };
  });

  await prisma.users.createMany({ data: payload, skipDuplicates: true });
}

async function resetSeedData() {
  await prisma.cardProgression.deleteMany();
  await prisma.capacidadeCognitivaAplicada.deleteMany();
  await prisma.comunicacaoOperacional.deleteMany();
  await prisma.execucaoConfiavel.deleteMany();
  await prisma.contribuicaoSistemica.deleteMany();
  await prisma.dailyDevPresence.deleteMany();
  await prisma.daily.deleteMany();
  await prisma.userStatistics.deleteMany();
  await prisma.cards.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.devsProjetos.deleteMany();
  await prisma.projetos.deleteMany();
}

function buildCardData(options: {
  sprintId: number;
  projectId: number;
  assigned: string;
  order: number;
  completed: boolean;
  finalStatus: Status;
  createdAt: Date;
  timingOverride?: CardTimingOverride;
}): CardCreateInput {
  const estimatedHours = 1.5 + Math.random() * 2.5; // 1.5h até ~4h
  const defaultTempoEstimado = Math.round(estimatedHours * 60); // minutos
  const defaultTempoReal = Math.round(
    realisticTempo(estimatedHours, options.completed) * 60
  );
  const tempoEstimado = options.timingOverride?.tempoEstimado ?? defaultTempoEstimado;
  const tempoReal = options.timingOverride?.tempo ?? defaultTempoReal;
  const difficulty = pickRandom(difficultyPool);
  const xpFlags = {
    xp_frontend: Math.random() > 0.65,
    xp_backend: Math.random() > 0.55,
    xp_negocios: Math.random() > 0.7,
    xp_arquitetura: Math.random() > 0.75,
    xp_design: Math.random() > 0.6,
    xp_data_analysis: Math.random() > 0.8,
  };

  return {
    titulo: `${SEED_LABEL} Card #${options.projectId}-${options.order}`,
    descricao: "Refinamento e implementação acompanhada",
    status: options.finalStatus,
    tempo_estimado: tempoEstimado,
    tempo: tempoReal,
    assigned: options.assigned,
    sprint: options.sprintId,
    projeto: options.projectId,
    prova_pr: `https://drive.google.com/${options.projectId}-${options.order}`,
    dod: "Revisado com mentor",
    dor: "Definido junto ao cliente",
    indicacao_conteudo: "https://apogeu.dev/trilhas/junior",
    computed: options.completed,
    difficulty,
    order: options.order,
    data_criacao: options.createdAt,
    ...xpFlags,
  } satisfies CardCreateInput;
}

function buildProgressionRecords(params: {
  cardId: number;
  projectId: number;
  sprintId: number;
  finalStatus: Status;
  sprintStart: Date;
}): ProgressionCreateInput[] {
  const sequence: Status[] = [Status.Backlog, Status.ToDo];
  if (params.finalStatus === Status.Done || params.finalStatus === Status.CanMine) {
    sequence.push(Status.Doing, params.finalStatus);
  } else if (params.finalStatus === Status.Doing) {
    sequence.push(Status.Doing);
  } else if (params.finalStatus === Status.Prevented) {
    sequence.push(Status.Doing, Status.Prevented);
  } else {
    sequence.push(params.finalStatus);
  }

  const records: ProgressionCreateInput[] = [];
  let cursor = addDays(params.sprintStart, 1);
  for (let i = 1; i < sequence.length; i++) {
    records.push({
      card_id: params.cardId,
      projeto_id: params.projectId,
      sprint_id: params.sprintId,
      from_status: sequence[i - 1],
      to_status: sequence[i],
      changed_at: cursor,
    });
    cursor = addDays(cursor, 2);
  }
  return records;
}

function getStatsAccumulator(map: Map<string, StatsAccumulator>, userId: string) {
  if (!map.has(userId)) {
    map.set(userId, {
      xp_frontend: 0,
      xp_backend: 0,
      xp_negocios: 0,
      xp_arquitetura: 0,
      xp_design: 0,
      xp_data_analysis: 0,
      total_throughput: 0,
      average_daily: 0,
      deltatime_predict: 0,
      hasDelta: false,
    });
  }
  return map.get(userId)!;
}

function applyCardToStats(card: CardCreateInput, statsMap: Map<string, StatsAccumulator>) {
  if (!card.assigned || !card.computed) return;

  const xpValue = xpMap[card.difficulty as keyof typeof xpMap] ?? 0;
  const stats = getStatsAccumulator(statsMap, card.assigned);

  for (const field of xpFields) {
    if ((card as any)[field]) {
      stats[field] += xpValue;
    }
  }

  const tempoReal = card.tempo ?? 0;
  const tempoEstimado = card.tempo_estimado ?? 0;
  let deltaPredict = 0;
  if (tempoReal > 0 && tempoEstimado > 0) {
    deltaPredict = (tempoReal / tempoEstimado - 1) * 100;
  }

  stats.total_throughput += tempoReal;
  stats.average_daily += tempoReal / 14;
  if (!stats.hasDelta) {
    stats.deltatime_predict = deltaPredict;
    stats.hasDelta = true;
  } else {
    stats.deltatime_predict = (stats.deltatime_predict + deltaPredict) / 2;
  }
}

async function persistUserStatistics(statsMap: Map<string, StatsAccumulator>) {
  if (!statsMap.size) return;

  const data = Array.from(statsMap.entries()).map(([userId, stats]) => ({
    user_clerk_id: userId,
    xp_frontend: Math.round(stats.xp_frontend),
    xp_backend: Math.round(stats.xp_backend),
    xp_negocios: Math.round(stats.xp_negocios),
    xp_arquitetura: Math.round(stats.xp_arquitetura),
    xp_design: Math.round(stats.xp_design),
    xp_data_analysis: Math.round(stats.xp_data_analysis),
    total_throughput: Math.round(stats.total_throughput),
    deltatime_predict: stats.deltatime_predict,
    average_daily: stats.average_daily,
  }));

  await prisma.userStatistics.createMany({ data, skipDuplicates: true });
}

async function createIndicatorsForDaily(params: {
  sprintId: number;
  dailyId: number;
  userIds: string[];
  sprintNumber: number;
  sprintCount: number;
  maturityTrendMode: MaturityTrendMode;
  goodCasePlan?: GoodCaseMaturityPlan;
  goodCaseTracker?: GoodCaseValidationTracker;
}) {
  const {
    sprintId,
    dailyId,
    userIds,
    sprintNumber,
    sprintCount,
    maturityTrendMode,
    goodCasePlan,
    goodCaseTracker,
  } = params;

  const isGoodCase = maturityTrendMode === "good_case_30pct";
  if (isGoodCase && !goodCasePlan) {
    throw new Error("Modo good_case_30pct exige plano de maturidade.");
  }

  const sprintSamples = Object.fromEntries(
    maturityFields.map((field) => [field, [] as number[]])
  ) as Record<MaturityField, number[]>;

  const resolveAttributeValue = (userId: string, field: MaturityField) => {
    if (isGoodCase) {
      const value = computeGoodCaseAttributeValue({
        userId,
        field,
        sprintNumber,
        sprintCount,
        plan: goodCasePlan!,
      });
      sprintSamples[field].push(value);
      return value;
    }

    if (field === "delta_time_predict") {
      return 1 + Math.floor(Math.random() * 5);
    }
    return juniorScore();
  };

  const capacidadePayload: CapacidadeCreateInput[] = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    reformulacao_problema: resolveAttributeValue(user_id, "reformulacao_problema"),
    separacao_sintoma_causa: resolveAttributeValue(user_id, "separacao_sintoma_causa"),
    autocritica_tecnica: resolveAttributeValue(user_id, "autocritica_tecnica"),
    escolha_abordagens_tecnicas: resolveAttributeValue(user_id, "escolha_abordagens_tecnicas"),
  }));

  const comunicacaoPayload: ComunicacaoCreateInput[] = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    validacao_entendimento_pre_execucao: resolveAttributeValue(
      user_id,
      "validacao_entendimento_pre_execucao"
    ),
    clareza_exposicao_tecnica: resolveAttributeValue(user_id, "clareza_exposicao_tecnica"),
    participacao_discussoes_tecnicas: resolveAttributeValue(
      user_id,
      "participacao_discussoes_tecnicas"
    ),
    sinalizacao_desalinhamento_ruido: resolveAttributeValue(
      user_id,
      "sinalizacao_desalinhamento_ruido"
    ),
  }));

  const execucaoPayload: ExecucaoCreateInput[] = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    delta_time_predict: resolveAttributeValue(user_id, "delta_time_predict"),
    reestimativa_ativa: resolveAttributeValue(user_id, "reestimativa_ativa"),
    estabilidade_throughput: resolveAttributeValue(user_id, "estabilidade_throughput"),
    sinalizacao_bloqueios: resolveAttributeValue(user_id, "sinalizacao_bloqueios"),
    qualidade_cards_dor: resolveAttributeValue(user_id, "qualidade_cards_dor"),
    aderencia_entregas_dod: resolveAttributeValue(user_id, "aderencia_entregas_dod"),
  }));

  const contribuicaoPayload: ContribuicaoCreateInput[] = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    ajudas_prestadas: resolveAttributeValue(user_id, "ajudas_prestadas"),
    sinalizacao_risco_tecnico_integracao: resolveAttributeValue(
      user_id,
      "sinalizacao_risco_tecnico_integracao"
    ),
    compartilhamento_solucoes: resolveAttributeValue(user_id, "compartilhamento_solucoes"),
    participacao_feedbacks: resolveAttributeValue(user_id, "participacao_feedbacks"),
  }));

  if (isGoodCase && goodCaseTracker) {
    for (const field of maturityFields) {
      const values = sprintSamples[field];
      const avg = values.reduce((acc, value) => acc + value, 0) / values.length;
      goodCaseTracker.perFieldSprintAverages[field].push(avg);
    }
  }

  await prisma.capacidadeCognitivaAplicada.createMany({ data: capacidadePayload });
  await prisma.comunicacaoOperacional.createMany({ data: comunicacaoPayload });
  await prisma.execucaoConfiavel.createMany({ data: execucaoPayload });
  await prisma.contribuicaoSistemica.createMany({ data: contribuicaoPayload });
}

async function createProject(params: {
  blueprint: ProjectBlueprint;
  mentorId: string;
  clientId: string;
  rhId?: string | null;
  studentIds: string[];
  statsMap: Map<string, StatsAccumulator>;
  maturityTrendMode?: MaturityTrendMode;
}) {
  const {
    blueprint,
    mentorId,
    clientId,
    rhId,
    studentIds,
    statsMap,
    maturityTrendMode = "default",
  } = params;
  if (studentIds.length < STUDENTS_PER_PROJECT) {
    throw new Error("Quantidade insuficiente de devs para o projeto");
  }
  const projectStart = new Date(BASE_YEAR, blueprint.startMonth, 1);
  const projectEnd = addMonths(projectStart, blueprint.durationMonths);
  const goodCasePlan =
    maturityTrendMode === "good_case_30pct"
      ? createGoodCaseMaturityPlan(studentIds)
      : undefined;
  const goodCaseThroughputPlan =
    maturityTrendMode === "good_case_30pct"
      ? createGoodCaseThroughputPlan(blueprint.sprintCount)
      : undefined;
  const goodCaseTracker =
    maturityTrendMode === "good_case_30pct"
      ? createGoodCaseValidationTracker(blueprint.name)
      : undefined;

  const project = await prisma.projetos.create({
    data: {
      nome: blueprint.name,
      valor: 4000 + Math.floor(Math.random() * 2000),
      status: blueprint.status,
      id_mentor: mentorId,
      id_cliente: clientId,
      id_helper: null,
      id_rh: rhId ?? null,
      repositorio: `apogeu/${blueprint.name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
      owner: "apogeu",
      token: null,
      dia_inicio: projectStart,
      dia_fim: projectEnd,
      logo_url: "https://cdn.apogeu.dev/logo.png",
    },
  });

  await prisma.devsProjetos.createMany({
    data: studentIds.map((dev_id) => ({ projeto_id: project.id, dev_id })),
  });

  for (let sprintNumber = 1; sprintNumber <= blueprint.sprintCount; sprintNumber++) {
    const sprintStart = addMonths(projectStart, sprintNumber - 1);
    const sprintEnd = addDays(sprintStart, 13);
    const sprint = await prisma.sprints.create({
      data: {
        id_projeto: project.id,
        numero: sprintNumber,
        objetivo: `Sprint ${sprintNumber} - ${blueprint.name}`,
        computed: sprintNumber <= blueprint.computedSprints,
        dia_inicio: sprintStart,
        dia_fim: sprintEnd,
      },
    });

    const daily = await prisma.daily.create({
      data: {
        projeto_id: project.id,
        sprint_id: sprint.id,
        conteudo: `Sincronização diária da sprint ${sprintNumber}`,
        criado_em: addDays(sprintStart, 2),
      },
    });

    await prisma.dailyDevPresence.createMany({
      data: studentIds.map((dev_id) => ({
        daily_id: daily.id,
        dev_id,
        presente: Math.random() > 0.15,
      })),
    });

    await createIndicatorsForDaily({
      sprintId: sprint.id,
      dailyId: daily.id,
      userIds: studentIds,
      sprintNumber,
      sprintCount: blueprint.sprintCount,
      maturityTrendMode,
      goodCasePlan,
      goodCaseTracker,
    });

    let goodCaseCardTimings: CardTimingOverride[] | undefined;
    if (maturityTrendMode === "good_case_30pct" && goodCaseThroughputPlan) {
      const throughputTarget =
        goodCaseThroughputPlan.throughputTargets[sprintNumber - 1];
      const deltaRatio = goodCaseThroughputPlan.deltaRatios[sprintNumber - 1];

      if (throughputTarget == null || deltaRatio == null) {
        throw new Error(
          `Plano de throughput incompleto para sprint ${sprintNumber} em ${blueprint.name}.`
        );
      }

      goodCaseCardTimings = createGoodCaseCardTimings({
        sprintNumber,
        sprintCount: blueprint.sprintCount,
        cardCount: CARDS_PER_SPRINT,
        throughputTarget,
        deltaRatio,
      });
    }

    let sprintThroughput = 0;
    let sprintAbsDelta = 0;

    for (let cardIndex = 0; cardIndex < CARDS_PER_SPRINT; cardIndex++) {
      const assigned = studentIds[(cardIndex + sprintNumber) % studentIds.length];
      const completed = sprintNumber <= blueprint.computedSprints;
      const finalStatus =
        maturityTrendMode === "good_case_30pct"
          ? Status.Done
          : completed
            ? pickRandom([Status.Done, Status.CanMine])
            : pickRandom([Status.ToDo, Status.Doing, Status.Prevented]);
      const cardData = buildCardData({
        sprintId: sprint.id,
        projectId: project.id,
        assigned,
        order: cardIndex + 1,
        completed: maturityTrendMode === "good_case_30pct" || finalStatus === Status.Done,
        finalStatus,
        createdAt: addDays(sprintStart, 1 + (cardIndex % 6)),
        timingOverride: goodCaseCardTimings?.[cardIndex],
      });

      const createdCard = await prisma.cards.create({ data: cardData });
      applyCardToStats(cardData, statsMap);

      if (maturityTrendMode === "good_case_30pct") {
        const tempoReal = cardData.tempo ?? 0;
        const tempoEstimado = cardData.tempo_estimado ?? 0;
        sprintThroughput += tempoReal;
        sprintAbsDelta += Math.abs(tempoReal - tempoEstimado);
      }

      const progressionRecords = buildProgressionRecords({
        cardId: createdCard.id,
        projectId: project.id,
        sprintId: sprint.id,
        finalStatus,
        sprintStart,
      });

      if (progressionRecords.length) {
        await prisma.cardProgression.createMany({ data: progressionRecords });
      }
    }

    if (maturityTrendMode === "good_case_30pct" && goodCaseTracker) {
      goodCaseTracker.sprintThroughputTotals.push(sprintThroughput);
      goodCaseTracker.sprintTempoDeltaAbsAverages.push(
        sprintAbsDelta / CARDS_PER_SPRINT
      );
    }
  }

  if (maturityTrendMode === "good_case_30pct" && goodCaseTracker) {
    validateGoodCaseMaturityTrend({
      projectName: blueprint.name,
      sprintCount: blueprint.sprintCount,
      tracker: goodCaseTracker,
    });
    validateGoodCaseThroughputTrend({
      projectName: blueprint.name,
      sprintCount: blueprint.sprintCount,
      tracker: goodCaseTracker,
    });
    console.log(`[Good Case] ${blueprint.name} validado em maturidade e throughput.`);
    console.log(
      `[Good Case] Throughput por sprint: ${goodCaseTracker.sprintThroughputTotals.join(
        " -> "
      )}`
    );
    console.log(
      `[Good Case] Delta médio |tempo-tempo_estimado|: ${goodCaseTracker.sprintTempoDeltaAbsAverages
        .map((value) => value.toFixed(2))
        .join(" -> ")}`
    );
  }
}

async function main() {
  await resetSeedData();
  const statsAccumulator = new Map<string, StatsAccumulator>();

  const mentors = await provisionRoleUsers("Mentor", PROJECT_BLUEPRINTS.length);
  const clients = await provisionRoleUsers("Cliente", 2);
  const rhs = await provisionRoleUsers("RH", Math.max(1, Math.ceil(PROJECT_BLUEPRINTS.length / 2)));
  const devs = await provisionRoleUsers(
    "Dev",
    PROJECT_BLUEPRINTS.length * STUDENTS_PER_PROJECT
  );

  await upsertLocalUsers([...mentors, ...clients, ...rhs, ...devs]);

  const primaryClient = clients[0];
  const secondaryClient = clients[1];
  let goodCaseAssigned = false;

  let devCursor = 0;
  for (let i = 0; i < PROJECT_BLUEPRINTS.length; i++) {
    const blueprint = PROJECT_BLUEPRINTS[i];
    const mentor = mentors[i % mentors.length];
    let client = secondaryClient;
    if (blueprint.status !== "Finalizado") {
      client = primaryClient;
    } else if (blueprint.name === GOOD_CASE_BLUEPRINT_NAME) {
      client = primaryClient;
      goodCaseAssigned = true;
    }
    const maturityTrendMode: MaturityTrendMode =
      blueprint.status === "Finalizado" && blueprint.name === GOOD_CASE_BLUEPRINT_NAME
        ? "good_case_30pct"
        : "default";
    const rh = rhs.length ? rhs[i % rhs.length] : undefined;
    const devSlice = devs.slice(devCursor, devCursor + STUDENTS_PER_PROJECT);
    devCursor += STUDENTS_PER_PROJECT;

    await createProject({
      blueprint,
      mentorId: mentor.id,
      clientId: client.id,
      rhId: rh?.id ?? null,
      studentIds: devSlice.map((dev) => dev.id),
      statsMap: statsAccumulator,
      maturityTrendMode,
    });
  }

  if (!goodCaseAssigned) {
    throw new Error(`Projeto good case não encontrado: ${GOOD_CASE_BLUEPRINT_NAME}`);
  }

  await persistUserStatistics(statsAccumulator);
}

main()
  .then(async () => {
    console.log("Seed concluído com sucesso.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Falha ao executar seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
