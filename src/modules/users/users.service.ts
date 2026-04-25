import { Prisma } from "@prisma/client";
import prisma from "../../clients/prisma.client";
import { ToUserDto } from "./schemas/to-user.schema";
import { UpdateUserDto } from "./schemas/update-user.schema";

const TIPO_PERFIL = {
  Mentor: "Mentor",
  Cliente: "Cliente",
  Dev: "Dev",
  Admin: "Admin",
  RH: "RH",
} as const;

type TipoPerfilValue = (typeof TIPO_PERFIL)[keyof typeof TIPO_PERFIL];

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

  async findUserByProjectId(id: string) {
    try {
      const projetoId = parseInt(id, 10); // Converte o ID para Int
      if (isNaN(projetoId)) {
        throw new Error("ID do projeto inválido");
      }
  
      const devsProjetos = await prisma.devsProjetos.findMany({
        where: { projeto_id: projetoId },
        include: {
          dev: true, // Inclui detalhes dos devs associados
        },
      });
  
      if (devsProjetos.length === 0) {
        throw new Error("Nenhum dev encontrado para este projeto");
      }
  
      return devsProjetos.map((ap: (typeof devsProjetos)[number]) => ap.dev); // Retorna apenas os detalhes dos devs
    } catch (error) {
      throw new Error( "Erro ao buscar devs do projeto");
    }
  }

  async newUser(toUserDto: ToUserDto) {
    try {
      const { tipo_perfil, ...rest } = toUserDto;
      const data: Prisma.UsersUncheckedCreateInput = {
        ...rest,
        tipo_perfil: this.normalizeTipoPerfil(tipo_perfil),
      };
      return await prisma.users.create({ data });
    } catch (error) {
        console.error("Erro no Prisma:", error);
      throw new Error("Falha ao criar usuário");
    }
  }

  async updateUser(id: string, toUserDto: Partial<ToUserDto>) {
    try {
      const { tipo_perfil, ...rest } = toUserDto;
      const data: Prisma.UsersUncheckedUpdateInput = {
        ...rest,
        ...(tipo_perfil
          ? { tipo_perfil: this.normalizeTipoPerfil(tipo_perfil) }
          : {}),
      };
      return await prisma.users.update({
        where: { user_clerk_id: id },
        data,
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

  private normalizeTipoPerfil(value?: string): TipoPerfilValue {
    if (!value) {
      throw new Error("tipo_perfil é obrigatório");
    }
    const normalized = value.trim().toLowerCase();
    switch (normalized) {
      case "mentor":
        return TIPO_PERFIL.Mentor;
      case "cliente":
        return TIPO_PERFIL.Cliente;
      case "dev":
        return TIPO_PERFIL.Dev;
      case "admin":
        return TIPO_PERFIL.Admin;
      case "rh":
        return TIPO_PERFIL.RH;
      default:
        throw new Error(`tipo_perfil inválido: ${value}`);
    }
  }
}

export default new UserService();
