import { setupDB } from "./db";
import { setupServer } from "./server";

async function main() {
  try {
    await setupServer();
    await setupDB(false);
  } catch (error) {
    console.error(error);
  }
}

main();
