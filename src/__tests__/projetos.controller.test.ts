import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import supertest from "supertest";
import projetoRoutes from "../modules/projetos/projetos.routes";

const prisma = new PrismaClient();
const app = fastify();

beforeAll(async () => {
  // Registra as rotas e inicializa o servidor
  app.register(projetoRoutes);
  await app.ready();
});

beforeEach(async () => {
  // Limpa a tabela 'projetos' antes de cada teste
  await prisma.projetos.deleteMany({});
});

afterAll(async () => {
  // Fecha o servidor e a conexão com o banco de dados
  await app.close();
  await prisma.$disconnect();
});

describe("CRUD - Projetos", () => {
  it("Deve criar um novo projeto (POST /projetos)", async () => {
    const newProject = {
      id_cliente: "1", // Alterado para string
      id_gestor: "2",  // Alterado para string
      nome: "Projeto Teste",
      valor: 50000,
      status: "Ativo",
    };

    const response = await supertest(app.server)
      .post("/projetos")
      .send(newProject)
      .expect(201);

    expect(response.body).toHaveProperty("id_cliente", "1");
    expect(response.body).toHaveProperty("nome", "Projeto Teste");
  });

  it("Deve buscar todos os projetos (GET /projetos)", async () => {
    // Insere um projeto de teste
    await prisma.projetos.create({
      data: {
        id_cliente: "1", // Alterado para string
        id_gestor: "2",  // Alterado para string
        nome: "Projeto Teste",
        valor: 50000,
        status: "Ativo",
      },
    });

    const response = await supertest(app.server).get("/projetos").expect(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("nome", "Projeto Teste");
  });

  it("Deve buscar um projeto por ID (GET /projetos/:id)", async () => {
    const projeto = await prisma.projetos.create({
      data: {
        id_cliente: "1", // Alterado para string
        id_gestor: "2",  // Alterado para string
        nome: "Projeto Teste",
        valor: 50000,
        status: "Ativo",
      },
    });

    const response = await supertest(app.server)
      .get(`/projetos/${projeto.id}`)
      .expect(200);

    expect(response.body).toHaveProperty("id", projeto.id);
    expect(response.body).toHaveProperty("nome", "Projeto Teste");
  });

  it("Deve atualizar um projeto existente (PUT /projetos/:id)", async () => {
    const projeto = await prisma.projetos.create({
      data: {
        id_cliente: "1", // Alterado para string
        id_gestor: "2",  // Alterado para string
        nome: "Projeto Original",
        valor: 40000,
        status: "Ativo",
      },
    });

    const updatedData = { nome: "Projeto Atualizado", valor: 60000 };

    const response = await supertest(app.server)
      .put(`/projetos/${projeto.id}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("nome", "Projeto Atualizado");
    expect(response.body).toHaveProperty("valor", 60000);
  });

  it("Deve deletar um projeto existente (DELETE /projetos/:id)", async () => {
    const projeto = await prisma.projetos.create({
      data: {
        id_cliente: "1", // Alterado para string
        id_gestor: "2",  // Alterado para string
        nome: "Projeto Teste",
        valor: 50000,
        status: "Ativo",
      },
    });

    await supertest(app.server).delete(`/projetos/${projeto.id}`).expect(200);

    const projetos = await prisma.projetos.findMany();
    expect(projetos).toHaveLength(0);
  });

  it("Deve retornar erro 404 ao buscar um projeto inexistente (GET /projetos/:id)", async () => {
    const response = await supertest(app.server).get("/projetos/999").expect(404);
    expect(response.body).toHaveProperty("Message", "Projeto não encontrado");
  });

  it("Deve retornar erro 400 ao criar um projeto com dados inválidos (POST /projetos)", async () => {
    const invalidProject = {
      id_cliente: "invalido",
      nome: "",
      valor: -100,
    };

    const response = await supertest(app.server)
      .post("/projetos")
      .send(invalidProject)
      .expect(400);

    expect(response.body).toHaveProperty("message");
  });
});