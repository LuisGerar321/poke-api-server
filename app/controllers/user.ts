import { Request, Response } from "express";
import { ErrorResponse } from "../utils/Errors";
import { IUser } from "../interfaces";
import { createUser } from "../services/user";

export default class UserController {
  public static async handleCreateUser(req: Request, res: Response) {
    try {
      const user: IUser = req.body;
      const newUser = await createUser(user);

      return res.status(201).send({
        status: 201,
        message: "User Created",
        data: newUser,
      });
    } catch (error) {
      if (error instanceof ErrorResponse) return res.status(error?.status).send(error);
      if (error instanceof Error) return res.status(500).send(new ErrorResponse({ status: 500, message: error.message, data: error }));
    }
  }
}
