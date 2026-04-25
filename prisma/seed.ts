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

const clerkSecret = process.env.CLERK_SECRET_KEY;
if (!clerkSecret) {
  throw new Error("CLERK_SECRET_KEY não definido. Configure o .env antes de rodar o seed.");
}

const clerk = createClerkClient({ secretKey: clerkSecret });

type CardCreateInput = Parameters<typeof prisma.cards.create>[0]["data"];

type ProgressionCreateInput = Parameters<
  typeof prisma.cardProgression.createMany
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
}): CardCreateInput {
  const estimatedHours = 1.5 + Math.random() * 2.5; // 1.5h até ~4h
  const tempoEstimado = Math.round(estimatedHours * 60); // minutos
  const tempoReal = Math.round(
    realisticTempo(estimatedHours, options.completed) * 60
  );
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
}) {
  const { sprintId, dailyId, userIds } = params;

  const capacidadePayload = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    reformulacao_problema: juniorScore(),
    separacao_sintoma_causa: juniorScore(),
    autocritica_tecnica: juniorScore(),
    escolha_abordagens_tecnicas: juniorScore(),
  }));

  const comunicacaoPayload = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    validacao_entendimento_pre_execucao: juniorScore(),
    clareza_exposicao_tecnica: juniorScore(),
    participacao_discussoes_tecnicas: juniorScore(),
    sinalizacao_desalinhamento_ruido: juniorScore(),
  }));

  const execucaoPayload = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    delta_time_predict: 1 + Math.floor(Math.random() * 5),
    reestimativa_ativa: juniorScore(),
    estabilidade_throughput: juniorScore(),
    sinalizacao_bloqueios: juniorScore(),
    qualidade_cards_dor: juniorScore(),
    aderencia_entregas_dod: juniorScore(),
  }));

  const contribuicaoPayload = userIds.map((user_id) => ({
    user_id,
    sprint_id: sprintId,
    daily_id: dailyId,
    ajudas_prestadas: juniorScore(),
    sinalizacao_risco_tecnico_integracao: juniorScore(),
    compartilhamento_solucoes: juniorScore(),
    participacao_feedbacks: juniorScore(),
  }));

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
}) {
  const { blueprint, mentorId, clientId, rhId, studentIds, statsMap } = params;
  if (studentIds.length < STUDENTS_PER_PROJECT) {
    throw new Error("Quantidade insuficiente de devs para o projeto");
  }
  const projectStart = new Date(BASE_YEAR, blueprint.startMonth, 1);
  const projectEnd = addMonths(projectStart, blueprint.durationMonths);

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
    });

    for (let cardIndex = 0; cardIndex < CARDS_PER_SPRINT; cardIndex++) {
      const assigned = studentIds[(cardIndex + sprintNumber) % studentIds.length];
      const completed = sprintNumber <= blueprint.computedSprints;
      const finalStatus = completed
        ? pickRandom([Status.Done, Status.CanMine])
        : pickRandom([Status.ToDo, Status.Doing, Status.Prevented]);
      const cardData = buildCardData({
        sprintId: sprint.id,
        projectId: project.id,
        assigned,
        order: cardIndex + 1,
        completed: finalStatus === Status.Done,
        finalStatus,
        createdAt: addDays(sprintStart, 1 + (cardIndex % 6)),
      });

      const createdCard = await prisma.cards.create({ data: cardData });
      applyCardToStats(cardData, statsMap);

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
  }
}

async function main() {
  await resetSeedData();
  const statsAccumulator = new Map<string, StatsAccumulator>();

  const mentors = await provisionRoleUsers("Mentor", PROJECT_BLUEPRINTS.length);
  const clients = await provisionRoleUsers("Cliente", PROJECT_BLUEPRINTS.length);
  const rhs = await provisionRoleUsers("RH", Math.max(1, Math.ceil(PROJECT_BLUEPRINTS.length / 2)));
  const devs = await provisionRoleUsers(
    "Dev",
    PROJECT_BLUEPRINTS.length * STUDENTS_PER_PROJECT
  );

  await upsertLocalUsers([...mentors, ...clients, ...rhs, ...devs]);

  let devCursor = 0;
  for (let i = 0; i < PROJECT_BLUEPRINTS.length; i++) {
    const blueprint = PROJECT_BLUEPRINTS[i];
    const mentor = mentors[i % mentors.length];
    const client = clients[i % clients.length];
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
    });
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
