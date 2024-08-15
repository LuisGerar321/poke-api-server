import { config } from "../config";
import { IUser } from "../interfaces";
import User from "../models/user";
import { ErrorResponse } from "../utils/Errors";
import jwt from "jsonwebtoken";

const { jwt: jwtConfig } = config;
export const createUser = async (payload: IUser) => {
  try {
    const user = await User.findOne({ where: { username: payload.username } });
    if (user) throw new ErrorResponse({ status: 400, message: "Users alrready on db, use other" });
    const newUser = await User.create({
      username: payload.username,
    });

    const token = jwt.sign({ id: newUser.id, username: newUser.username }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });

    return { ...newUser.toJSON(), token };
  } catch (error) {
    console.warn("createUser was broken retriving this error: ");
    console.error(error);
    throw error;
  }
};
