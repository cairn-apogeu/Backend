import 'dotenv/config'
import Fastify from "fastify";
import cors from "@fastify/cors";
import { clerkClient, clerkPlugin, getAuth } from '@clerk/fastify'

// Importa rotas modulares
import projetoRoutes from "./modules/projetos/projetos.routes";
import cardsRoutes from "./modules/Cards/Cards.routes";
import usersRoutes from "./modules/users/users.routes";
import sprintRoutes from "./modules/Sprints/sprints.routes";

const app = Fastify({ logger: true });
app.register(clerkPlugin);

// Configuração do CORS
app.register(cors, {
  origin: true, // Permite qualquer origem. Substitua por um domínio específico, se necessário.
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
});

// Configuração do Clerk

// Hook global para proteger todas as rotas
app.addHook("preHandler", async (request, reply) => {

  try {
    // Use `getAuth()` to get the user's ID
    const { userId } = getAuth(request)

    // If user isn't authenticated, return a 401 error
    if (!userId) {
      return reply.code(401).send({ error: 'User not authenticated' })
    }

    console.log(userId);
    


  } catch (error) {
    app.log.error(error)
    return reply.code(500).send({ error: 'Failed to retrieve user' })
  }
})

// Registro das rotas modulares
app.register(projetoRoutes); // Rotas para projetos
app.register(cardsRoutes);   // Rotas para cards
app.register(usersRoutes);   // Rotas para usuários
app.register(sprintRoutes);  // Rotas para sprints

// Inicialização do servidor
const start = async () => {
  try {
    await app.listen({ port: 3333, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:3333");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
