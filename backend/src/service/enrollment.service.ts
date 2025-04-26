import { PrismaClient, Status } from "@prisma/client";
const prisma = new PrismaClient();


export const enrollClientInProgram = async (enrollmentData: any, userId: string) => {
  return await prisma.enrollment.create({
    data: {
      ...enrollmentData,
      enrolledById: userId,
    },
    include: {
      client: true,
      program: true,
    },
  });
};


export const getClientEnrollments = async (clientId: string) => {
  return await prisma.enrollment.findMany({
    where: { clientId },
    include: { program: true },
  });
};

export const getProgramEnrollments = async (programId: string) => {
  return await prisma.enrollment.findMany({
    where: { programId },
    include: { client: true },
  });
};

export const updateEnrollmentStatus = async (enrollmentId: string, status: Status) => {
  return await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status },
  });
};

// Delete an enrollment
export const deleteEnrollment = async (enrollmentId: string) => {
  return await prisma.enrollment.delete({
    where: { id: enrollmentId },
  });
};
