import User from "../models/user";
import { IUser } from "../interfaces";
import { ErrorResponse } from "../utils/Errors";
import { config } from "../config";
import jwt from "jsonwebtoken";

const { jwt: jwtConfig } = config;
export const auth = async (credentials: IUser): Promise<{ token: string }> => {
  try {
    const user = await User.findOne({ where: { ...credentials } });
    if (!user || user.username !== credentials.username)
      throw new ErrorResponse({
        status: 401,
        message: "Unauthorized",
      });

    console.log("the secrect ", jwtConfig.secretKey);
    const token = jwt.sign({ id: user.id, username: user.username }, jwtConfig.secretKey, { expiresIn: jwtConfig.expiresIn });

    return { token };
  } catch (error) {
    console.warn("getTypes was broken retriving this error: ");
    console.error(error);
    throw error;
  }
};
