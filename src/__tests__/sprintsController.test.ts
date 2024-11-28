import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import supertest from 'supertest';
import sprintRoutes from '../modules/Sprints/sprints.routes';

const prisma = new PrismaClient();
const app = fastify();

let clienteId: string;
let gestorId: string;
let projetoId: number;

beforeAll(async () => {
  app.register(sprintRoutes);
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Limpando os dados antes de cada teste
  await prisma.sprints.deleteMany();
  await prisma.projetos.deleteMany();
  await prisma.users.deleteMany();
});


describe('POST /sprints', () => {
  it('should create a new sprint', async () => {
    const cliente = await prisma.users.create({
      data: {
        user_clerk_id: '123',
        tipo_perfil: 'cliente',
      },
    });
  
    const gestor = await prisma.users.create({
      data: {
        user_clerk_id: '124',
        tipo_perfil: 'gestor',
      },
    });
  
    const projeto = await prisma.projetos.create({
      data: {
        id_cliente: cliente.user_clerk_id,
        id_gestor: gestor.user_clerk_id,
        nome: 'Projeto Teste',
        valor: 5000,
        status: 'Ativo',
      },
    });
  
    clienteId = cliente.user_clerk_id;
    gestorId = gestor.user_clerk_id;
    projetoId = projeto.id;

    const newSprint = {
      id_projeto: projetoId, // Reutilizando projeto criado no beforeEach
      numero: 2,
    };

    const response = await supertest(app.server)
      .post('/sprints')
      .send(newSprint)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('id_projeto', projetoId);
    expect(response.body).toHaveProperty('numero', 2);
  });

  it('should return 400 for invalid data', async () => {
    const invalidSprint = {
      id_projeto: 'invalid', 
      numero: 1, // Faltando id_projeto
    };

    const response = await supertest(app.server)
      .post('/sprints')
      .send(invalidSprint)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Validation error');
  });
});

describe('GET /sprints/:id', () => {
  it('should return sprint details', async () => {
    // Criando um cliente
    const cliente = await prisma.users.create({
      data: {
        user_clerk_id: '123',
        tipo_perfil: 'cliente',
      },
    });
  
    // Criando um gestor
    const gestor = await prisma.users.create({
      data: {
        user_clerk_id: '124',
        tipo_perfil: 'gestor',
      },
    });
  
    // Criando um projeto
    const projeto = await prisma.projetos.create({
      data: {
        id_cliente: cliente.user_clerk_id,
        id_gestor: gestor.user_clerk_id,
        nome: 'Projeto Teste',
        valor: 5000,
        status: 'Ativo',
      },
    });
  
    // Criando uma sprint
    const sprint = await prisma.sprints.create({
      data: {
        id_projeto: projeto.id,
        numero: 1,
      },
    });
  
    // Buscando os detalhes da sprint
    const response = await supertest(app.server)
      .get(`/sprints/${sprint.id}`) // Usando o ID da sprint recém-criada
      .expect(200);
  
    // Verificando a resposta
    expect(response.body).toHaveProperty('id', sprint.id);
    expect(response.body).toHaveProperty('id_projeto', sprint.id_projeto);
    expect(response.body).toHaveProperty('numero', sprint.numero);
  });
  

  it('should return 404 if sprint does not exist', async () => {
    const response = await supertest(app.server)
      .get('/sprints/99999')
      .expect(404);
      expect(response.body).toHaveProperty('message', 'Not found');
   
  });
});

describe('PUT /sprints/:id', () => {
  it('should update an existing sprint', async () => {
     // Criando um cliente
     const cliente = await prisma.users.create({
      data: {
        user_clerk_id: '123',
        tipo_perfil: 'cliente',
      },
    });
  
    // Criando um gestor
    const gestor = await prisma.users.create({
      data: {
        user_clerk_id: '124',
        tipo_perfil: 'gestor',
      },
    });
  
    // Criando um projeto
    const projeto = await prisma.projetos.create({
      data: {
        id_cliente: cliente.user_clerk_id,
        id_gestor: gestor.user_clerk_id,
        nome: 'Projeto Teste',
        valor: 5000,
        status: 'Ativo',
      },
    });

    const projeto2 = await prisma.projetos.create({
      data: {
        id_cliente: cliente.user_clerk_id,
        id_gestor: gestor.user_clerk_id,
        nome: 'Projeto Teste2',
        valor: 5000,
        status: 'Ativo',
      },
    });
  
   
  await prisma.sprints.create({
    data: {
      id_projeto: projeto.id, // Reutilizando projeto criado no beforeEach
      numero: 1,
    },
  });
    const updateData = {
      id_projeto: projeto2.id, // Reutilizando projeto criado no beforeEach
      numero: 2,
    };

    const sprint = await prisma.sprints.findFirst();

    const response = await supertest(app.server)
      .put(`/sprints/${sprint?.id}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('id', sprint?.id);
    expect(response.body).toHaveProperty('numero', 2);
  });

  it('should return 404 if sprint does not exist', async () => {
     // Criando um cliente
     const cliente = await prisma.users.create({
      data: {
        user_clerk_id: '123',
        tipo_perfil: 'cliente',
      },
    });
  
    // Criando um gestor
    const gestor = await prisma.users.create({
      data: {
        user_clerk_id: '124',
        tipo_perfil: 'gestor',
      },
    });
  
    // Criando um projeto
    const projeto = await prisma.projetos.create({
      data: {
        id_cliente: cliente.user_clerk_id,
        id_gestor: gestor.user_clerk_id,
        nome: 'Projeto Teste',
        valor: 5000,
        status: 'Ativo',
      },
    });

    const inexistentSprint = {
      id_projeto: projeto.id,
      numero: 5,
    }

    const response = await supertest(app.server)
      .put('/sprints/9999')
      .send(inexistentSprint)
      .expect(404);

    expect(response.body).toHaveProperty('message', 'Sprint not found');
  });

  it('should return 400 for invalid data', async () => {
    const invalidUpdate = {
      numero: 'invalid', // Dados inválidos
    };

    const sprint = await prisma.sprints.findFirst();

    const response = await supertest(app.server)
      .put(`/sprints/${sprint?.id}`)
      .send(invalidUpdate)
      .expect(400);

    expect(response.body).toHaveProperty('message', 'Validation error');
  });
});
