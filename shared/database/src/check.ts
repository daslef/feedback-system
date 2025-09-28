import { db } from "./index";
import { env } from "./env";

async function checkConnection() {
  return await db.introspection.getTables();
}

checkConnection()
  .then((meta) => {
    const checkDatabase = env.ENV === "production" ? "postgres" : "sqlite";

    console.log(`Connection for ${checkDatabase} OK`);
    console.log(meta.map(({ name }) => name).join(", "));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
