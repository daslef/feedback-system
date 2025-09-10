import { db } from "./index";
import { sql } from "kysely";

async function migrate() {
  await db.schema
    .createTable("project")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("latitude", "float8", (col) => col.notNull())
    .addColumn("longitude", "float8", (col) => col.notNull())
    .addColumn("year_of_completion", "numeric", (col) => col.notNull())
    .addColumn("administrative_unit_id", "numeric", (col) => col.notNull())
    .addColumn("project_type_id", "numeric", (col) => col.notNull())
    .addColumn("title", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("project_type")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("administrative_unit")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("feedback")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("project_id", "numeric", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("person_contact_id", "numeric", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn("feedback_status_id", "numeric", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("feedback_status")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("status", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("feedback_image")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("feedback_id", "numeric", (col) => col.notNull())
    .addColumn("link_to_s3", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("person")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("middle_name", "text", (col) => col.notNull())
    .addColumn("person_type_id", "numeric", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("person_type")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("person_contact")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("contact_type_id", "numeric", (col) => col.notNull())
    .addColumn("person_id", "numeric", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("contact")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("contact_type_id", "numeric", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("person_id", "numeric", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("contact_type")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("official_responsibility")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("project_type_id", "numeric", (col) => col.notNull())
    .addColumn("administrative_unit_id", "numeric", (col) => col.notNull())
    .addColumn("official_id", "numeric", (col) => col.notNull())
    .execute();

  console.log("база данных успешно создана! :D");
  process.exit(0);
}

migrate().catch((error) => {
  console.error("ошибка миграции :(", error);
  process.exit(1);
});
