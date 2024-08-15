import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { config } from "./config";

const dbConfig: SequelizeOptions = {
  ...config.db,
  port: config.db.port,
  logging: false,
  models: [__dirname + "/models"],
};

const sequelize = new Sequelize(dbConfig);

export async function setupDB(force = false): Promise<void> {
  return new Promise((resolve, reject) => {
    sequelize
      .authenticate()
      .then(() => {
        sequelize
          .sync({ force })
          .then(() => {
            console.log("Connection DB ok!");
            resolve();
          })
          .catch((err) => {
            console.log("Connection DB not working!");
            reject(err);
          });
      })
      .catch((err) => {
        console.log("Connection DB not working, bad credential!");
        reject(err);
      });
  });
}

export default sequelize;
