import prisma from '../../clients/prisma.client';

export const getAll = async () => {
  return prisma.devsProjetos.findMany();
};

export const getById = async (projeto_id: number, dev_id: string) => {
  return prisma.devsProjetos.findUnique({
    where: { projeto_id_dev_id: { projeto_id, dev_id } },
  });
};

export const getByProjetoId = async (projeto_id: number) => {
  return prisma.devsProjetos.findMany({
    where: { projeto_id },
  });
};

export const create = async (data: { projeto_id: number; dev_id: string }) => {
  return prisma.devsProjetos.create({ data });
};

export const remove = async (projeto_id: number, dev_id: string) => {
  return prisma.devsProjetos.delete({
    where: { projeto_id_dev_id: { projeto_id, dev_id } },
  });
};
