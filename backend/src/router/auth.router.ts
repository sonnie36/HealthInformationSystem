import { RegisterController, LoginController } from "../controller/auth.controller";
import { Router } from "express";

export const auth_router = Router();

auth_router.post("/register", RegisterController);
auth_router.post("/login", LoginController);