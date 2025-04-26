import { Router } from "express";
import { authenticateToken, authorizeDoctor } from "../middleware/auth.middleware";
import {
  CreateProgramController,
  GetAllProgramsController,
  GetProgramByIdController,
  UpdateProgramController,
  DeleteProgramController,
} from "../controller/program.controller";

export const program_router = Router();

program_router.post("/create", authorizeDoctor, CreateProgramController);
program_router.put("/update/:id", authorizeDoctor, UpdateProgramController);
program_router.delete("/delete/:id", authorizeDoctor, DeleteProgramController);

program_router.get("/all", authenticateToken, GetAllProgramsController);
program_router.get("/:id", authenticateToken, GetProgramByIdController);
