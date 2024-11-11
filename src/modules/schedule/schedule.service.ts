import prisma from "../../clients/prisma.client";
import userService from "../user/user.service";
import { CreatePairingDto } from "./schemas/create-pairing-schema";
import { ToScheduleWithPairingDto } from "./schemas/to-schedule-with-pairing.schema";
import { ToScheduleDto } from "./schemas/to-schedule.schema";
import { UpdateScheduleDto } from "./schemas/update-schedule.schema";
import { SCHEDULE_STATUS } from "./schemas/update-status.schema";

class ScheduleService {
    // Retrieve all schedules
    async findAll() {
        try {
            return await prisma.schedule.findMany();
        } catch (error) {
            throw new Error("Schedules not found");
        }
    }

    // Retrieve a specific schedule by ID
    async findById(id: string) {
        try {
            return await prisma.schedule.findUnique({
                where: { id },
            });
        } catch (error) {
            throw new Error("Failed to find schedule");
        }
    }

    // Retrieve schedules by user ID
    async findSchedulesByUserId(userId: string) {
        const user_schedules = await prisma.user_schedule.findMany({
            where: {
                user_id: userId,
                schedule: { datetime: { gte: new Date() } }
            },
            include: {
                schedule: true,
            }
        });

        const groups = await prisma.group.findMany({
            where: {
                user_group: { some: { user_id: userId } },
                event: { schedule_id: { in: user_schedules.map(schedule => schedule.schedule.id) } }
            },
            include: {
                event: { include: { restaurant: true } },
            }
        });

        return user_schedules.map(user_schedule => ({
            ...user_schedule, group: groups.find(group => group.event.schedule_id === user_schedule.schedule.id)
        }))
    }

    // Create a schedule
    async toSchedule(toScheduleDto: ToScheduleDto) {
        return await prisma.schedule.upsert({
            where: {
                datetime: toScheduleDto.datetime,
            },
            update: {
                user_schedules: {
                    create: {
                        user_id: toScheduleDto.user_id,
                    },
                },
            },
            create: {
                datetime: toScheduleDto.datetime,
                user_schedules: {
                    create: {
                        user_id: toScheduleDto.user_id,
                    },
                },
            },
        });
    }

    // Create a schedule with pairing
    async toScheduleWithPairing(toScheduleWithPairingDto: ToScheduleWithPairingDto) {
        const paired_user = await userService.getUserByInstagram(toScheduleWithPairingDto.paired_user_instagram);
        if (!paired_user) throw new Error("Failed to find user by instagram username");
        if (paired_user.status !== 'ACCEPTED') throw new Error("Cannot schedule a user non verified");

        return await prisma.schedule.upsert({
            where: {
                datetime: toScheduleWithPairingDto.datetime,
            },
            update: {
                user_schedules: {
                    createMany: {
                        data: [
                            { user_id: toScheduleWithPairingDto.user_id },
                            { user_id: paired_user.id },
                        ]
                    },
                },
                pairings: {
                    create: {
                        primary_user_id: toScheduleWithPairingDto.user_id,
                        paired_user_id: paired_user.id,
                    }
                }
            },
            create: {
                datetime: toScheduleWithPairingDto.datetime,
                user_schedules: {
                    createMany: {
                        data: [
                            { user_id: toScheduleWithPairingDto.user_id },
                            { user_id: paired_user.id },
                        ]
                    },
                },
                pairings: {
                    create: {
                        primary_user_id: toScheduleWithPairingDto.user_id,
                        paired_user_id: paired_user.id,
                    }
                }
            },
        });
    }

    // Update a schedule by ID
    async update(id: string, updateScheduleDto: UpdateScheduleDto) {
        try {
            return await prisma.schedule.update({
                where: { id },
                data: updateScheduleDto,
            });
        } catch (error) {
            throw new Error("Failed to update schedule");
        }
    }

    // Update the user status of a schedule
    async updateStatus({ id, userId, status }: { id: string, userId: string, status: SCHEDULE_STATUS }) {
        return await prisma.schedule.update({
            where: { id },
            data: {
                user_schedules: {
                    update: {
                        where: {
                            user_id_schedule_id: {
                                user_id: userId,
                                schedule_id: id,
                            }
                        },
                        data: { status }
                    }
                }
            },
        });
    }
}

export default new ScheduleService();
