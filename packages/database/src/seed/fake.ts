import {
  rand,
  seed,
  randFirstName,
  randLastName,
  randProductDescription,
} from "@ngneat/falso";
import type { Kysely } from "kysely";
import type { Database } from "../interface";

export async function seedPersons(db: Kysely<Database>) {
  for (let i = 0; i < 10; i++) {
    await db
      .insertInto("person")
      .values({
        first_name: randFirstName(),
        last_name: randLastName(),
        middle_name: randFirstName(),
        person_type_id: 1,
      })
      .execute();
  }
}

export async function seedFeedbacks(db: Kysely<Database>) {
  const projects = await db.selectFrom("project").select(["id"]).execute();
  const persons = await db.selectFrom("person").select(["id"]).execute();
  const statuses = await db
    .selectFrom("feedback_status")
    .select(["id"])
    .execute();

  const projectIds = projects.map((p) => p.id);
  const personIds = persons.map((p) => p.id);
  const statusIds = statuses.map((s) => s.id);

  for (let i = 0; i < 30; i++) {
    await db
      .insertInto("feedback")
      .values({
        project_id: rand(projectIds),
        description: randProductDescription(),
        person_contact_id: rand(personIds),
        created_at: new Date().toISOString(),
        feedback_status_id: rand(statusIds),
      })
      .execute();
  }
}

seed("static");
