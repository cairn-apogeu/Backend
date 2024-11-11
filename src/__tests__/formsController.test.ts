// import fastify from 'fastify';
// import { PrismaClient } from '@prisma/client';
// import supertest from 'supertest';
// import { formsController } from '../modules/user/formsController'; // Ajuste o caminho conforme necessário

// const prisma = new PrismaClient();
// const app = fastify();

// beforeAll(async () => {
//   await formsController(app);
//   await app.ready();
// });

// beforeEach(async () => {
//   // Limpa o banco de dados antes de cada teste
//   await prisma.formulario.deleteMany({});
//   await prisma.usuario.deleteMany({});
// });

// afterAll(async () => {
//   await app.close();
//   await prisma.$disconnect();
// });

// describe('POST /formulario', () => {
//   it('should create a new form', async () => {
//     const newUser = await prisma.usuario.create({
//       data: {
//         usu_id: 'user1',
//         Nome: 'User One',
//       },
//     });

//     const newForm = {
//       usu_id: newUser.usu_id,
//       Instagram: 'user1_insta',
//       Linkedin: 'user1_linkedin',
//       Objetivo: 'Objective 1',
//       Ocupacao: 'Occupation 1',
//       Setor: 'Sector 1',
//       Hierarquia: 1,
//       Introversao: 1,
//       Fase: 'Phase 1',
//       Assuntos: 'Subjects 1',
//       NivelRandimidade: 'Level 1',
//       Hobbies: 'Hobbies 1',
//       Religiao: 'Religion 1',
//       Acontecimento: 'Event 1',
//       Noturno: true,
//       ExperienciaGastronomica: 'Gastronomic Experience 1',
//       Culinarias: 'Cuisines 1',
//       NovosSabores: true,
//       Bebidas: 'Drinks 1',
//       RestricaoAlimentar: 'Food Restriction 1',
//     };

//     const response = await supertest(app.server)
//       .post('/formulario')
//       .send(newForm)
//       .expect(201);

//     expect(response.body).toHaveProperty('usu_id', newUser.usu_id);
//     expect(response.body).toHaveProperty('Instagram', 'user1_insta');
//   });

//   it('should return 400 when trying to create a form with an existing id', async () => {
//     const newUser = await prisma.usuario.create({
//       data: {
//         usu_id: 'user3',
//         Nome: 'User Three',
//       },
//     });

//     const newForm = {
//       usu_id: newUser.usu_id,
//       Instagram: 'user3_insta',
//       Linkedin: 'user3_linkedin',
//       Objetivo: 'Objective 3',
//       Ocupacao: 'Occupation 3',
//       Setor: 'Sector 3',
//       Hierarquia: 3,
//       Introversao: 3,
//       Fase: 'Phase 3',
//       Assuntos: 'Subjects 3',
//       NivelRandimidade: 'Level 3',
//       Hobbies: 'Hobbies 3',
//       Religiao: 'Religion 3',
//       Acontecimento: 'Event 3',
//       Noturno: false,
//       ExperienciaGastronomica: 'Gastronomic Experience 3',
//       Culinarias: 'Cuisines 3',
//       NovosSabores: false,
//       Bebidas: 'Drinks 3',
//       RestricaoAlimentar: 'Food Restriction 3',
//     };

//     await supertest(app.server)
//       .post('/formulario')
//       .send(newForm)
//       .expect(201);

//     // Tenta criar o mesmo formulário novamente
//     const response = await supertest(app.server)
//       .post('/formulario')
//       .send(newForm)
//       .expect(400);

//     expect(response.body).toHaveProperty('message', 'Form with this user ID already exists');
//   });


//   it('should create a new form with missing optional fields', async () => {
//     const newUser = await prisma.usuario.create({
//       data: {
//         usu_id: 'user2',
//         Nome: 'User Two',
//       },
//     });

//     const newForm = {
//       usu_id: newUser.usu_id,
//       Instagram: 'user2_insta',
//       Linkedin: 'user2_linkedin',
//       Objetivo: 'Objective 2',
//       Ocupacao: 'Occupation 2',
//       Setor: 'Sector 2',
//       Hierarquia: 2,
//       Introversao: 2,
//       Fase: 'Phase 2',
//       Assuntos: 'Subjects 2',
//       NivelRandimidade: 'Level 2',
//       Hobbies: 'Hobbies 2',
//       Religiao: 'Religion 2',
//       Acontecimento: 'Event 2',
//       Noturno: false,
//       ExperienciaGastronomica: 'Gastronomic Experience 2',
//       Culinarias: 'Cuisines 2',
//       NovosSabores: false,
//       Bebidas: 'Drinks 2',
//       RestricaoAlimentar: 'Food Restriction 2',
//     };

//     const response = await supertest(app.server)
//       .post('/formulario')
//       .send(newForm)
//       .expect(201);

//     expect(response.body).toHaveProperty('usu_id', newUser.usu_id);
//     expect(response.body).toHaveProperty('Instagram', 'user2_insta');
//   });

//   it('should return 400 for invalid data', async () => {
//     const invalidForm = {
//       usu_id: '',
//       Instagram: '',
//     };

//     const response = await supertest(app.server)
//       .post('/formulario')
//       .send(invalidForm)
//       .expect(400);

//     expect(response.body).toHaveProperty('message', 'Validation error');
//   });
// });
