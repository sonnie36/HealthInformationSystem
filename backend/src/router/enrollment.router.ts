import { Router } from "express";
import {
  enrollClientController,
  getClientEnrollmentsController,
  getProgramEnrollmentsController,
  updateEnrollmentStatusController,
  deleteEnrollmentController,
  getAllEnrollmentsController,
} from "../controller/enrollment.controller";
import { authorizeDoctor } from "../middleware/auth.middleware";

const enroll_router = Router();

enroll_router.post("/enroll",authorizeDoctor, enrollClientController);
enroll_router.get("/client/:clientId", getClientEnrollmentsController);
enroll_router.get("/program/:id", getProgramEnrollmentsController);
enroll_router.put("/update/:id", authorizeDoctor, updateEnrollmentStatusController);
enroll_router.patch("/enrollments/:id", authorizeDoctor,updateEnrollmentStatusController);
enroll_router.delete("/enrollments/:id",authorizeDoctor, deleteEnrollmentController);
enroll_router.get("/all", authorizeDoctor, getAllEnrollmentsController);

export default enroll_router;
