import dotenv from "dotenv";
import { SequelizeOptions } from "sequelize-typescript";

dotenv.config();

export const config = {
  apiVersion: process.env.API_VERSION || "v1",
  server: {
    port: Number(process.env.SERVER_PORT) || 3001,
    host: process.env.SERVER_HOST || "localhost",
  },
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    database: process.env.DB_NAME || "mydatabase",
    username: process.env.DB_USER_NAME || "root",
    password: process.env.DB_PASS || "password",
  } as SequelizeOptions,
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
};
