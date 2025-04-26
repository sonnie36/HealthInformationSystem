import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createProgram,
  getAllPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
} from "../service/program.service";

export const CreateProgramController = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const createdById = req.user?.id as string;
    const program = await createProgram(name, description, createdById);

    res.status(201).json({ message: "Program created successfully", data: program });
  } catch (error: any) {
    res.status(400).json({ message: "Failed to create program", error: error.message });
  }
};

export const GetAllProgramsController = async (_req: Request, res: Response) => {
  try {
    const programs = await getAllPrograms();
    res.status(200).json({ message: "Programs retrieved successfully", data: programs });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to retrieve programs", error: error.message });
  }
};

export const GetProgramByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = await getProgramById(id);

    if (!program) {
      res.status(404).json({ message: "Program not found" });
      return;
    }

    res.status(200).json({ message: "Program retrieved successfully", data: program });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to retrieve program", error: error.message });
  }
};

export const UpdateProgramController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await updateProgram(id, req.body);

    res.status(200).json({ message: "Program updated successfully", data: updated });
  } catch (error: any) {
    res.status(400).json({ message: "Failed to update program", error: error.message });
  }
};

export const DeleteProgramController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteProgram(id);

    res.status(204).json({ message: "Program deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: "Failed to delete program", error: error.message });
  }
};