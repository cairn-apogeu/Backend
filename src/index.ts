import fastify from 'fastify';
import restauranteRoutes from './modules/restaurant/restaurant.routes';
import cors from '@fastify/cors';
import userRoutes from './modules/user/user.routes';
import groupRoutes from './modules/group/group.routes';
import scheduleRoutes from './modules/schedule/schedule.routes';
import eventRoutes from './modules/event/event.routes';

const app = fastify();

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

app.register(userRoutes);
app.register(restauranteRoutes);
app.register(groupRoutes);
app.register(scheduleRoutes);
app.register(eventRoutes);

app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});