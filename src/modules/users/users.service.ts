import prisma from "../../clients/prisma.client";
import { ToUserDto } from "./schemas/to-user.schema";
import { UpdateUserDto } from "./schemas/update-user.schema";

class UserService {
  async findAll() {
    try {
      return await prisma.users.findMany();
    } catch (error) {
      throw new Error("Tabela 'Users' não encontrada");
    }
  }

  async findById(id: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { user_clerk_id: id },
      });
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      return user;
    } catch (error) {
      throw new Error("Usuário não encontrado");
    }
  }

  async newUser(toUserDto: ToUserDto) {
    try {

      return await prisma.users.create({ data: toUserDto });
    } catch (error) {
        console.error("Erro no Prisma:", error);
      throw new Error("Falha ao criar usuário");
    }
  }

  async updateUser(id: string, toUserDto: Partial<ToUserDto>) {
    try {


      return await prisma.users.update({
        where: { user_clerk_id: id },
        data : toUserDto,
      });
    } catch (error) {
      throw new Error("Falha ao atualizar usuário");
    }
  }

  async deleteUser(id: string) {
    try {
      return await prisma.users.delete({
        where: { user_clerk_id: id },
      });
    } catch (error) {
      throw new Error("Falha ao deletar usuário");
    }
  }
}

export default new UserService();
