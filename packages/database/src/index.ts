import path from "path";
import SqliteDatabase from "better-sqlite3";
import { Pool, type PoolConfig } from "pg";
import { Kysely, SqliteDialect, PostgresDialect } from "kysely";
import type { Database } from "./interface";

function getDialect() {
  const postgresURI = process.env.POSTGRES_DATABASE_URI;

  if (postgresURI) {
    return new PostgresDialect({
      pool: new Pool(postgresURI as PoolConfig),
    });
  }

  return new SqliteDialect({
    database: new SqliteDatabase(
      path.join(import.meta.dirname, "..", "data.db"),
    ),
  });
}

export const db = new Kysely<Database>({
  dialect: getDialect(),
});
