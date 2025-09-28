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
  if (env.ENV === "production") {
    return new PostgresDialect({
      pool: new Pool({
        connectionString: env.POSTGRES_DATABASE_URI,
        ssl: false,
      }),
    });
  }

  return new SqliteDialect({
    database: new SqliteDatabase(env.SQLITE_DATABASE_URI),
  });
}

export const db = new Kysely<Database>({
  dialect: getDialect(),
  plugins: [new ParseJSONResultsPlugin()],
});

export { type Database, jsonObjectFrom };
