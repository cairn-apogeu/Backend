import { FastifyRequest, FastifyReply } from "fastify";
import userService from "./users.service";
import { UserIdSchema } from "./schemas/user-id.schema";
import { ToUserDto, ToUserSchema } from "./schemas/to-user.schema";
import { UpdateUserDto, UpdateUserSchema } from "./schemas/update-user.schema";

class UserController {
  async findAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await userService.findAll();
      reply.send(users);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async findById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = UserIdSchema.parse(request.params);
    try {
      const user = await userService.findById(id);
      reply.send(user);
    } catch (error) {
      reply.status(404).send({ message: error });
    }
  }

      async findUserbyProjectId(
        request: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
      ) {
        const { id } = UserIdSchema.parse(request.params);
        try {
          const user = await userService.findUserByProjectId(id);
          reply.send(user);
        } catch (error) {
          reply.status(404).send({ message: error });
        }
      }

  async newUser(
    request: FastifyRequest<{ Body: ToUserDto }>,
    reply: FastifyReply
  ) {
    const toUserDto = ToUserSchema.parse(request.body);
    try {
      const user = await userService.newUser(toUserDto);
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async updateUser(
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateUserDto;
    }>,
    reply: FastifyReply
  ) {
    const toUserDto = UpdateUserSchema.parse(request.body);
    const { id } = UserIdSchema.parse(request.params);
    try {
      const updatedUser = await userService.updateUser(id, toUserDto);
      reply.send(updatedUser);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }

  async deleteUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = UserIdSchema.parse(request.params);
    try {
      const user = await userService.deleteUser(id);
      reply.send(user);
    } catch (error) {
      reply.status(500).send({ message: error });
    }
  }
}

export default new UserController();
