import fastify from 'fastify';
import cors from '@fastify/cors';
import cardsRoutes from './modules/Cards/Cards.routes';
const app = fastify();

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.register(cardsRoutes);

app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});