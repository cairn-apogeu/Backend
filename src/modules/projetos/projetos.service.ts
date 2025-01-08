import prisma from "../../clients/prisma.client";
import { ToProjetosDto } from "./schemas/to-projetos.schema";

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
      return await prisma.projetos.findUnique({
        where: { id: 1 },
      });
    } catch (error) {
      console.log("Erro no service", error);
      throw new Error("Projeto não encontrado");
    }
  }

  async findByUserId(id: string) {
    try {
      // Busca os projetos relacionados ao aluno pelo ID
      const projetos = await prisma.alunosProjetos.findMany({
        where: { aluno_id: id },
        include: {
          projeto: true, // Inclui os detalhes do projeto
        },
      });
  
      // Retorna apenas os projetos
      return projetos.map((alunoProjeto) => alunoProjeto.projeto);
    } catch (error) {
      throw new Error("Projetos não encontrados para o aluno.");
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
      return await prisma.projetos.update({
        where: { id },
        data: toProjetosDto,
      });
    } catch (error) {
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
