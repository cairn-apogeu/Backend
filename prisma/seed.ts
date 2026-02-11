import "dotenv/config";
import { createClerkClient } from "@clerk/clerk-sdk-node";
import prisma from "../src/clients/prisma.client";

const COMPLETED_PROJECTS = 4;
const SPRINTS_PER_PROJECT = 5;
const CARDS_PER_SPRINT = 10;
const STUDENTS_PER_PROJECT = 6;
const DEFAULT_PASSWORD = "ApogeuSeed!123";
const SEED_LABEL = "Seed";

type SeedRole = "Mentor" | "Cliente" | "Aluno";

type SeededUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: SeedRole;
};

const statusPool = ["Backlog", "ToDo", "Doing", "Done", "Prevented", "CanMine"];
const difficultyPool = ["MUITO_FACIL", "FACIL", "MEDIO", "DIFICIL", "MUITO_DIFICIL"] as const;
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

async function ensureClerkUser(role: SeedRole, index: number): Promise<SeededUser> {
  const firstName = `${role} ${index + 1}`;
  const lastName = "Seed";
  const email = `${SEED_LABEL.toLowerCase()}-${role.toLowerCase()}-${index + 1}@apogeu.dev`;
  const username = `${SEED_LABEL.toLowerCase()}_${role.toLowerCase()}_${index + 1}`
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 32);
  const metadataRole = role === "Aluno" ? "Dev" : role;

  const existing = await clerk.users.getUserList({
    emailAddress: [email],
    limit: 1,
  });

  if (existing.length > 0) {
    const user = existing[0];
    try {
      await clerk.users.updateUser(user.id, {
        username,
        publicMetadata: { tipo_perfil: metadataRole },
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
    publicMetadata: { tipo_perfil: metadataRole },
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
const payload = users.map((user) => ({
    user_clerk_id: user.id,
    tipo_perfil: user.role,
    discord: `seed${user.id.slice(-4)}`.slice(0, 20),
    linkedin: `apogeu-${user.id.slice(-6)}`.slice(0, 30),
    github: `seed-${user.id.slice(-6)}`.slice(0, 30),
    objetivo_curto: `Objetivo curto de ${user.firstName}`.slice(0, 255),
    objetivo_medio: `Objetivo médio de ${user.firstName}`.slice(0, 255),
    objetivo_longo: `Objetivo longo de ${user.firstName}`.slice(0, 255),
    genero: "ND",
    nascimento: new Date("1997-01-01"),
    biografia: `${SEED_LABEL} profile para ${user.role}`.slice(0, 255),
  }));

  await prisma.users.createMany({ data: payload, skipDuplicates: true });
}

async function resetSeedData() {
  await prisma.userStatistics.deleteMany();
  await prisma.cards.deleteMany();
  await prisma.sprints.deleteMany();
  await prisma.alunosProjetos.deleteMany();
  await prisma.projetos.deleteMany();
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function buildCardData(options: {
  sprintId: number;
  projectId: number;
  assigned: string;
  order: number;
  completed: boolean;
}): Parameters<typeof prisma.cards.createMany>[0]["data"][number] {
  const tempoEstimado = 4 + Math.floor(Math.random() * 8);
  const tempoReal = tempoEstimado + Math.floor(Math.random() * 3);

  const xpFlags = {
    xp_frontend: Math.random() > 0.4,
    xp_backend: Math.random() > 0.4,
    xp_negocios: Math.random() > 0.5,
    xp_arquitetura: Math.random() > 0.6,
    xp_design: Math.random() > 0.5,
    xp_data_analysis: Math.random() > 0.6,
  };

  return {
    titulo: `${SEED_LABEL} Card #${options.projectId}-${options.order}`,
    descricao: "Implementação de funcionalidade semente",
    status: pickRandom(statusPool),
    tempo_estimado: tempoEstimado,
    tempo: tempoReal,
    assigned: options.assigned,
    sprint: options.sprintId,
    projeto: options.projectId,
    prova_pr: `https://drive.google.com/${options.projectId}-${options.order}`,
    dod: "Definição de pronto validada com QA",
    dor: "Definição de pronto revisada com cliente",
    indicacao_conteudo: "https://apogeu.dev/recursos/kanban",
    computed: options.completed,
    difficulty: pickRandom(difficultyPool),
    order: options.order,
    data_criacao: new Date(),
    ...xpFlags,
  };
}

function getStatsAccumulator(
  map: Map<string, StatsAccumulator>,
  userId: string
): StatsAccumulator {
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

function applyCardToStats(
  card: Parameters<typeof prisma.cards.createMany>[0]["data"][number],
  statsMap: Map<string, StatsAccumulator>
) {
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

async function createProject(params: {
  name: string;
  status: string;
  mentorId: string;
  clientId: string;
  studentIds: string[];
  sprintComputedUntil: number;
  statsMap: Map<string, StatsAccumulator>;
}) {
  const project = await prisma.projetos.create({
    data: {
      nome: params.name,
      valor: 5000 + Math.floor(Math.random() * 2000),
      status: params.status,
      id_mentor: params.mentorId,
      id_cliente: params.clientId,
      id_helper: null,
      repositorio: "apogeu/backend",
      owner: "apogeu",
      token: null,
      dia_inicio: new Date("2024-01-01"),
      dia_fim: params.status === "Finalizado" ? new Date("2024-06-30") : new Date("2024-12-31"),
      logo_url: "https://cdn.apogeu.dev/logo.png",
    },
  });

  await prisma.alunosProjetos.createMany({
    data: params.studentIds.map((studentId) => ({
      projeto_id: project.id,
      aluno_id: studentId,
    })),
  });

  for (let sprintNumber = 1; sprintNumber <= SPRINTS_PER_PROJECT; sprintNumber++) {
    const sprint = await prisma.sprints.create({
      data: {
        id_projeto: project.id,
        numero: sprintNumber,
        objetivo: `${SEED_LABEL} Sprint ${sprintNumber} - ${params.name}`,
        computed: sprintNumber <= params.sprintComputedUntil,
        dia_inicio: new Date(2024, sprintNumber, 1),
        dia_fim: new Date(2024, sprintNumber, 20),
      },
    });

    const cardsPayload = Array.from({ length: CARDS_PER_SPRINT }).map((_, idx) => {
      const card = buildCardData({
        sprintId: sprint.id,
        projectId: project.id,
        assigned: pickRandom(params.studentIds),
        order: idx + 1,
        completed: sprintNumber <= params.sprintComputedUntil,
      });
      applyCardToStats(card, params.statsMap);
      return card;
    });

    await prisma.cards.createMany({ data: cardsPayload });
  }
}

async function main() {
  await resetSeedData();
  const statsAccumulator = new Map<string, StatsAccumulator>();

  const mentors = await provisionRoleUsers("Mentor", COMPLETED_PROJECTS + 1);
  const clients = await provisionRoleUsers("Cliente", COMPLETED_PROJECTS + 1);
  const students = await provisionRoleUsers(
    "Aluno",
    (COMPLETED_PROJECTS + 1) * STUDENTS_PER_PROJECT
  );

  await upsertLocalUsers([...mentors, ...clients, ...students]);

  let studentCursor = 0;
  for (let i = 0; i < COMPLETED_PROJECTS; i++) {
    const projectStudents = students.slice(
      studentCursor,
      studentCursor + STUDENTS_PER_PROJECT
    );
    studentCursor += STUDENTS_PER_PROJECT;

    await createProject({
      name: `${SEED_LABEL} Projeto Finalizado ${i + 1}`,
      status: "Finalizado",
      mentorId: mentors[i].id,
      clientId: clients[i].id,
      studentIds: projectStudents.map((s) => s.id),
      sprintComputedUntil: SPRINTS_PER_PROJECT,
      statsMap: statsAccumulator,
    });
  }

  const activeStudents = students.slice(
    studentCursor,
    studentCursor + STUDENTS_PER_PROJECT
  );

  await createProject({
    name: `${SEED_LABEL} Projeto Em Andamento`,
    status: "Em andamento",
    mentorId: mentors[mentors.length - 1].id,
    clientId: clients[clients.length - 1].id,
    studentIds: activeStudents.map((s) => s.id),
    sprintComputedUntil: 4,
    statsMap: statsAccumulator,
  });

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
