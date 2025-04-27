import { PrismaClient, Status } from "@prisma/client";
const prisma = new PrismaClient();

export const enrollClientInProgram = async (enrollmentData: any, userId: string) => {
  if (!enrollmentData || !userId) {
    throw new Error("Enrollment data and user ID are required.");
  }

  const { clientId, programId } = enrollmentData;

  // Check if client exists
  const clientExists = await prisma.client.findUnique({ where: { id: clientId } });
  if (!clientExists) {
    throw new Error("Client does not exist.");
  }

  // Check if program exists
  const programExists = await prisma.program.findUnique({ where: { id: programId } });
  if (!programExists) {
    throw new Error("Program does not exist.");
  }

  // Check if client is already enrolled in the program
  const existingEnrollment = await prisma.enrollment.findFirst({
    where: { clientId, programId },
  });
  if (existingEnrollment) {
    throw new Error("Client is already enrolled in this program.");
  }

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
  if (!clientId) {
    throw new Error("Client ID is required.");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { clientId },
    include: { program: true, client: true },
  });

  if (enrollments.length === 0) {
   return enrollments
  }

  return enrollments;
};

export const getProgramEnrollments = async (programId: string) => {
  if (!programId) {
    throw new Error("Program ID is required.");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { programId },
    include: { client: true },
  });

  if (enrollments.length === 0) {
    throw new Error("No enrollments found for the specified program.");
  }

  return enrollments;
};

export const updateEnrollmentStatus = async (enrollmentId: string, status: Status) => {
  if (!enrollmentId || !status) {
    throw new Error("Enrollment ID and status are required.");
  }

  const enrollmentExists = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollmentExists) {
    throw new Error("Enrollment not found.");
  }

  return await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status },
  });
};

export const deleteEnrollment = async (enrollmentId: string) => {
  if (!enrollmentId) {
    throw new Error("Enrollment ID is required.");
  }

  const enrollmentExists = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollmentExists) {
    throw new Error("Enrollment not found.");
  }

  return await prisma.enrollment.delete({
    where: { id: enrollmentId },
  });
};

export const getAllEnrollments = async () => {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      client: true,
      program: true,
      enrolledBy: true,
    },
  });

  if (enrollments.length === 0) {
    throw new Error("No enrollments found.");
  }

  return enrollments;
};