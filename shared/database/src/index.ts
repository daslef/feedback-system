import SqliteDatabase from "better-sqlite3";
import { Pool } from "pg";
import {
  Kysely,
  SqliteDialect,
  PostgresDialect,
  ParseJSONResultsPlugin,
} from "kysely";

import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { env } from "./env";
import type { Database } from "./interface";

function getDialect() {
  if (env.ENV === "production" || env.ENV === "staging") {
    const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
      env;
    const POSTGRES_DATABASE_URI = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}`;

    return new PostgresDialect({
      pool: new Pool({
        connectionString: POSTGRES_DATABASE_URI,
        ssl: false,
      }),
    });
  }

  return new SqliteDialect({
    database: new SqliteDatabase(
      env.ENV === "development" ? env.SQLITE_DATABASE_URI : "data.db",
    ),
  });
}

export const db = new Kysely<Database>({
  dialect: getDialect(),
  plugins: [new ParseJSONResultsPlugin()],
});

export { type Database, jsonObjectFrom };
