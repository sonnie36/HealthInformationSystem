import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createProgram = async ( name: string, description: string, createdById: string) => {
  return await prisma.program.create({
    data:{
      name,
      description,
      createdById: createdById
    }
  });
};

export const getAllPrograms = async () => {
  return await prisma.program.findMany({
    include: {
      createdBy: {
        select: { id: true, fullName: true },
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const getProgramById = async (id: string) => {
  return await prisma.program.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { id: true, fullName: true },
      },
    }
  });
};

export const updateProgram = async (id: string, data: { name?: string; description?: string }) => {
  return await prisma.program.update({
    where: { id },
    data,
  });
};

export const deleteProgram = async (id: string) => {
  return await prisma.program.delete({
    where: { id },
  });
};
