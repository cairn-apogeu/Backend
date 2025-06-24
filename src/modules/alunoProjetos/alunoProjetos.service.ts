import prisma from '../../clients/prisma.client';

export const getAll = async () => {
  return prisma.alunosProjetos.findMany();
};

export const getById = async (projeto_id: number, aluno_id: string) => {
  return prisma.alunosProjetos.findUnique({
    where: { projeto_id_aluno_id: { projeto_id, aluno_id } },
  });
};

export const getByProjetoId = async (projeto_id: number) => {
  return prisma.alunosProjetos.findMany({
    where: { projeto_id },
  });
};

export const create = async (data: { projeto_id: number; aluno_id: string }) => {
  return prisma.alunosProjetos.create({ data });
};

export const remove = async (projeto_id: number, aluno_id: string) => {
  return prisma.alunosProjetos.delete({
    where: { projeto_id_aluno_id: { projeto_id, aluno_id } },
  });
};
