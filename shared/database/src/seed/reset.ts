import type { Kysely, TableExpression } from "kysely";
import type { Database } from "../interface";

export default async function resetDatabase(db: Kysely<Database>) {
  const tables = await db.introspection.getTables();
  for (const table of tables) {
    const tableName = table.name as TableExpression<Database, never>;
    await db.deleteFrom(tableName).execute();
  }
}
