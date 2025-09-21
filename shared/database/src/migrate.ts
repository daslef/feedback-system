import { db } from "./index";
import { sql } from "kysely";

async function migrate() {
  await db.schema
    .createTable("project")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("latitude", "float8", (col) => col.notNull())
    .addColumn("longitude", "float8", (col) => col.notNull())
    .addColumn("year_of_completion", "integer", (col) => col.notNull())
    .addColumn("administrative_unit_id", "integer", (col) =>
      col.references("administrative_unit.id").onDelete("set null"),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createTable("administrative_unit_type")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("administrative_unit")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .addColumn("unit_type_id", "integer", (col) =>
      col.references("administrative_unit_type.id").onDelete("set null"),
    )
    .execute();

  await db.schema
    .createTable("feedback")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("project_id", "integer", (col) =>
      col.references("project.id").onDelete("cascade").notNull(),
    )
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("feedback_type_id", "integer", (col) =>
      col.references("feedback_type.id").notNull(),
    )
    .addColumn("topic_id", "integer", (col) =>
      col.references("topic.id").onDelete("cascade").notNull(),
    )
    .addColumn("person_email_contact_id", "integer", (col) =>
      col.references("person_contact.id").onDelete("cascade").notNull(),
    )
    .addColumn("feedback_status_id", "integer", (col) =>
      col.references("feedback_status.id").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();

  await db.schema
    .createTable("topic")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("topic_category")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("topic_category_topic")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("topic_id", "integer", (col) =>
      col.references("topic.id").notNull().onDelete("cascade"),
    )
    .addColumn("topic_category_id", "integer", (col) =>
      col.references("topic_category.id").notNull().onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("feedback_type")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("feedback_status")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("feedback_image")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("feedback_id", "integer", (col) =>
      col.notNull().references("feedback.id").onDelete("cascade"),
    )
    .addColumn("link_to_s3", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("person")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("middle_name", "text", (col) => col.notNull())
    .addColumn("person_type_id", "integer", (col) =>
      col.references("person_type.id").onDelete("set null"),
    )
    .addColumn("contact_id", "integer", (col) =>
      col.references("person_type.id").onDelete("cascade"),
    )
    .execute();

  await db.schema
    .createTable("person_type")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("title", "text", (col) => col.notNull().unique())
    .execute();

  await db.schema
    .createTable("person_contact")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("phone", "text")
    .addColumn("social", "text")
    .execute();

  await db.schema
    .createTable("official_responsibility")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("administrative_unit_id", "integer", (col) =>
      col.references("administrative_unit.id").notNull().onDelete("cascade"),
    )
    .addColumn("official_id", "integer", (col) =>
      col.notNull().references("person.id").onDelete("cascade"),
    )
    .execute();

  console.log("база данных успешно создана! :D");
  process.exit(0);
}

migrate().catch((error) => {
  console.error("ошибка миграции :(", error);
  process.exit(1);
});
