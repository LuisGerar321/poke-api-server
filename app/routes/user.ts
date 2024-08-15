import { Router } from "express";
import UserController from "../controllers/user";
import { validateSchema } from "../middlewares";
import { createUserSchema } from "../validators";

const User = Router();

User.post("/", validateSchema(createUserSchema), UserController.handleCreateUser);

export default User;
