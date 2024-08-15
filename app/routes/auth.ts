import { Router } from "express";
import { validateSchema } from "../middlewares";
import { createUserSchema } from "../validators";
import AuthController from "../controllers/auth";

const Auth = Router();

Auth.post("/", validateSchema(createUserSchema), AuthController.handleAuthUser);

export default Auth;
