import { Request, Response } from "express";
import { ErrorResponse } from "../utils/Errors";
import { IUser } from "../interfaces";
import { auth } from "../services/auth";

export default class AuthController {
  public static async handleAuthUser(req: Request, res: Response) {
    try {
      const user: IUser = req.body;
      const newUser = await auth(user);

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
