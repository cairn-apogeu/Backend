import { FastifyInstance } from 'fastify';
import scheduleController from './schedule.controller';

export default async function scheduleRoutes(app: FastifyInstance) {
    app.post('/schedules', scheduleController.toSchedule);
    app.post('/schedules/pairing', scheduleController.toScheduleWithPairing);
    app.get('/schedules', scheduleController.findAll);
    app.get('/schedules/user/:userId', scheduleController.findSchedulesByUserId);
    app.get('/schedules/:id', scheduleController.findById);
    app.put('/schedules/:id', scheduleController.update);
    app.put('/schedules/:id/user/:userId', scheduleController.updateStatus);
};
