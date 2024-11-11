import { FastifyRequest, FastifyReply } from 'fastify';
import { ScheduleIdSchema } from './schemas/schedule-id.schema';
import { UpdateScheduleDto, UpdateScheduleSchema } from './schemas/update-schedule.schema';
import scheduleService from './schedule.service';
import { ToScheduleDto, ToScheduleSchema } from './schemas/to-schedule.schema';
import { ToScheduleWithPairingSchema } from './schemas/to-schedule-with-pairing.schema';
import { UpdateStatusBody, UpdateStatusBodyDto, UpdateStatusParams } from './schemas/update-status.schema';
import { UserIdSchema } from './schemas/user-id.schema';

class ScheduleController {
    async findAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const schedules = await scheduleService.findAll();
            reply.send(schedules);
        } catch (error) {
            reply.status(500).send({ message: error });
        }
    }

    async findById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
        const { id } = ScheduleIdSchema.parse(request.params);
        try {
            const schedule = await scheduleService.findById(id);
            reply.send(schedule);
        } catch (error) {
            reply.status(404).send({ message: error });
        }
    }

    async toSchedule(request: FastifyRequest<{ Body: ToScheduleDto }>, reply: FastifyReply) {
        const toScheduleSchema = ToScheduleSchema.parse(request.body);
        try {
            const schedule = await scheduleService.toSchedule(toScheduleSchema);
            reply.code(201).send(schedule);
        } catch (error) {
            console.log(error)
            reply.status(500).send({ message: 'Failed to schedule' });
        }
    }

    async toScheduleWithPairing(request: FastifyRequest<{ Body: ToScheduleDto }>, reply: FastifyReply) {
        const toScheduleWithPairingSchema = ToScheduleWithPairingSchema.parse(request.body);
        try {
            const schedule = await scheduleService.toScheduleWithPairing(toScheduleWithPairingSchema);
            reply.code(201).send(schedule);
        } catch (error) {
            reply.status(500).send({ message: 'Failed to schedule with pairing' });
        }
    }

    async update(request: FastifyRequest<{ Params: { id: string }; Body: UpdateScheduleDto }>, reply: FastifyReply) {
        const { id } = ScheduleIdSchema.parse(request.params);
        const updateScheduleSchema = UpdateScheduleSchema.parse(request.body);
        try {
            const updatedSchedule = await scheduleService.update(id, updateScheduleSchema);
            reply.send(updatedSchedule);
        } catch (error) {
            reply.status(500).send({ message: error });
        }
    }

    async updateStatus(request: FastifyRequest<{ Params: { id: string, userId: string }; Body: UpdateStatusBodyDto }>, reply: FastifyReply) {
        const { id, userId } = UpdateStatusParams.parse(request.params);
        const { status } = UpdateStatusBody.parse(request.body);
        try {
            const updatedUserSchedule = await scheduleService.updateStatus({ id, userId, status });
            reply.send(updatedUserSchedule);
        } catch (error) {
            console.log(error)
            reply.status(500).send({ message: 'Failed to update schedule status' });
        }
    }

    async findSchedulesByUserId(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
        const { userId } = UserIdSchema.parse(request.params);
        console.log('aaaa', userId)
        try {
            const schedules = await scheduleService.findSchedulesByUserId(userId);
            reply.send(schedules);
        } catch (error) {
            console.log(error)
            reply.status(500).send({ message: 'Failed to find schedule of a user' });
        }
    }
}

export default new ScheduleController();
