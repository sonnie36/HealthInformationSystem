import { Request, Response } from "express";
import {
  enrollClientInProgram,
  getClientEnrollments,
  getProgramEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
  getAllEnrollments,
} from "../service/enrollment.service";
import { AuthRequest } from "../middleware/auth.middleware";

export const enrollClientController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized. User not found." });
      return;
    }

    const enrollment = await enrollClientInProgram(req.body, userId);

    res.status(201).json({ message: "Client enrolled successfully", enrollment });
  } catch (error: any) {
    console.error("Error enrolling client:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to enroll client" });
  }
};

export const getClientEnrollmentsController = async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;
    console.log("Client ID:", clientId); // Debugging line to check the client ID
    const enrollments = await getClientEnrollments(clientId);

    res.status(200).json({ message: "Client enrollments retrieved successfully", enrollments });
  } catch (error: any) {
    console.error("Error fetching client enrollments:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to fetch client enrollments" });
  }
};

export const getProgramEnrollmentsController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enrollments = await getProgramEnrollments(id);

    res.status(200).json({ message: "Program enrollments retrieved successfully", enrollments });
  } catch (error: any) {
    console.error("Error fetching program enrollments:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to fetch program enrollments" });
  }
};

export const updateEnrollmentStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: "Status is required" });
      return;
    }

    const updatedEnrollment = await updateEnrollmentStatus(id, status);

    res.status(200).json({ message: "Enrollment status updated successfully", updatedEnrollment });
  } catch (error: any) {
    console.error("Error updating enrollment status:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to update enrollment status" });
  }
};

export const deleteEnrollmentController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await deleteEnrollment(id);

    res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting enrollment:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to delete enrollment" });
  }
};

export const getAllEnrollmentsController = async (_req: Request, res: Response) => {
  try {
    const enrollments = await getAllEnrollments();
    res.status(200).json({ message: "All enrollments retrieved successfully", enrollments });
  } catch (error: any) {
    console.error("Error fetching all enrollments:", error);
    res.status(error.status || 500).json({ message: error.message || "Failed to fetch all enrollments" });
  }
};
