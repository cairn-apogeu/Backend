
import fastify from "fastify";
import cors from "@fastify/cors";
import projetoRoutes from "./modules/projetos/projetos.routes";
import cardsRoutes from './modules/Cards/Cards.routes';
import usersRoutes from './modules/users/users.routes';
import sprintRoutes from './modules/Sprints/sprints.routes';
const app = fastify();


app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(projetoRoutes);
app.register(cardsRoutes);
app.register(usersRoutes)
app.register(sprintRoutes);

app.listen({ port: 3333, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});