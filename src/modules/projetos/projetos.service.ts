import prisma from "../../clients/prisma.client";
import { ToProjetosDto } from "./schemas/to-projetos.schema";
import { encryptData } from '../../utils/encryptData';
import { decryptData } from '../../utils/decryptData';
import axios from "axios";

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
        try {
          toProjetosDto.token = await encryptData(toProjetosDto.token);
        } catch (encryptError) {
          console.error("Erro ao criptografar o token:", encryptError);
          throw new Error("Falha ao criptografar o token");
        }
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

  async getGithubContent(id: number, filePath: string, branch: string) {
    try {
      const projeto = await prisma.projetos.findUnique({ where: { id } });

      if (!projeto || !projeto.token) {
        throw new Error("Projeto ou token não encontrado.");
      }

      const token = decryptData(projeto.token);
      const url = `https://api.github.com/repos/${projeto.owner}/${projeto.repositorio}/contents/${filePath}`;
      console.log(projeto.owner, projeto.repositorio, token, url);
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3.raw",
        },
        params: { ref: branch },
      });

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar conteúdo do GitHub:", error);
      throw new Error("Erro ao buscar conteúdo do GitHub.");
    }
  }
}

export default new ProjetoService();
