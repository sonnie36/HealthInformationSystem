import { Router } from "express";
import {
  enrollClientController,
  getClientEnrollmentsController,
  getProgramEnrollmentsController,
  updateEnrollmentStatusController,
  deleteEnrollmentController,
} from "../controller/enrollment.controller";
import { authorizeDoctor } from "../middleware/auth.middleware";

const enroll_router = Router();

enroll_router.post("/enroll",authorizeDoctor, enrollClientController);
enroll_router.get("/client/:id3", getClientEnrollmentsController);
enroll_router.get("/program/:id", getProgramEnrollmentsController);
enroll_router.patch("/enrollments/:id", authorizeDoctor,updateEnrollmentStatusController);
enroll_router.delete("/enrollments/:id",authorizeDoctor, deleteEnrollmentController);

export default enroll_router;
