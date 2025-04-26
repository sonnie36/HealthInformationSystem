import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const registerClient = async (clientData:any, userId:string) => {
  return await prisma.client.create({
    data: {
      ...clientData,
      registeredById: userId,
    },

  });
};

export const getClients = async (filters: any = {}, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize;
  const clients = await prisma.client.findMany({
    where: filters,
    skip,
    take: pageSize,
  });
  const total = await prisma.client.count({ where: filters });
  return { clients, total };
};

export const getClientById = async (id: string) => {
  return await prisma.client.findUnique({
    where: { id },
  });
};

export const updateClient = async (id: string, updateData: any) => {
  return await prisma.client.update({
    where: { id },
    data: updateData,
  });
};

export const searchClients = async (query: string) => {
  return await prisma.client.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: "insensitive" } },
        { lastName: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
  });
};
