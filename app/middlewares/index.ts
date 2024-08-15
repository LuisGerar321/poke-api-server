import { IUser, ReqWithUser } from "../interfaces";
import { config } from "../config";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../models/user";

const { jwt: jwtConfig } = config;

export const validateSchema = (schema: Joi.ObjectSchema<any>) => {
  return function (req: Request, res: Response, next: NextFunction) {
    if (schema === null) return next();
    const { body } = req;
    const isValid = schema.validate(body);
    if (isValid?.error) {
      return res.status(400).send({
        status: 400,
        statusMessage: "Bad request",
        message: isValid.error.message,
      });
    }
    next();
  };
};

export const validateToken = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({
      status: 401,
      statusMessage: "Unauthorized",
      message: "Token not provided or invalid format",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log(`Token: [${token}]`);
    console.log(`Secret Key: [${jwtConfig.secretKey}]`);

    const decoded: IUser = jwt.verify(token, jwtConfig.secretKey);

    console.log(decoded);
    const user = await User.findOne({ where: { username: decoded.username, id: decoded.id } });
    if (!user || user.username !== decoded.username)
      return res.status(401).send({
        status: 401,
        statusMessage: "Unauthorized",
        message: "Invalid token",
      });
    req.id = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      status: 401,
      statusMessage: "Unauthorized",
      message: "Invalid token",
    });
  }
};
