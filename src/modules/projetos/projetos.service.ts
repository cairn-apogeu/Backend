import prisma from "../../clients/prisma.client";
import { ToProjetosDto } from "./schemas/to-projetos.schema";
import { encryptData } from '../../utils/encryptData';
import { decryptData } from '../../utils/decryptData';

class ProjetoService {
  async findAll() {
    try {
      return await prisma.projetos.findMany();
    } catch (error) {
      throw new Error("Tabela 'Projetos' não encontrada");
    }
  }

  async findById(id: number) {
    try {
        const projeto = await prisma.projetos.findUnique({
            where: { id },
        });

        if (projeto && projeto.token) {
            projeto.token = decryptData(projeto.token);
        }

        return projeto;
    } catch (error) {
        console.log("Erro no service", error);
        throw new Error("Projeto não encontrado");
    }
}

  async newProjeto(toProjetosDto: ToProjetosDto) {
    try {
      return await prisma.projetos.create({
        data: {
          id_cliente: toProjetosDto.id_cliente,
          id_gestor: toProjetosDto.id_gestor,
          nome: toProjetosDto.nome,
          valor: toProjetosDto.valor,
          status: toProjetosDto.status,
        },
      });
    } catch (error) {
      throw new Error("Falha ao criar projeto");
    }
  }

  async updateProjeto(id: number, toProjetosDto: Partial<ToProjetosDto>) {
    try {
        if (toProjetosDto.token) {
            toProjetosDto.token = await encryptData(toProjetosDto.token);
        }
        return await prisma.projetos.update({
            where: { id },
            data: toProjetosDto,
        });
    } catch (error) {
        console.error("Erro ao atualizar projeto:", error);
        throw new Error("Falha ao atualizar projeto");
    }
}

  async deleteProjeto(id: number) {
    try {
      return await prisma.projetos.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error("Falha ao deletar projeto");
    }
  }
}

export default new ProjetoService();
