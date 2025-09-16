import {
  rand,
  seed,
  randFirstName,
  randLastName,
  randProductDescription,
  randEmail,
  randPhoneNumber,
  randSocial,
} from "@ngneat/falso";
import type { Kysely } from "kysely";
import type { Database } from "../interface";

export async function seedPersonsAndContacts(db: Kysely<Database>) {
  const personTypes = await db
    .selectFrom("person_type")
    .select(["id"])
    .execute();

  const personTypesIds = personTypes.map((p) => p.id);

  await Promise.all(Array(10).map(async () => {
    try {
      const newPersonContact = await db
        .insertInto("person_contact")
        .values({
          email: randEmail(),
          phone: randPhoneNumber(),
          social: randSocial().link,
        })
        .executeTakeFirstOrThrow();

      await db
        .insertInto("person")
        .values({
          first_name: randFirstName(),
          last_name: randLastName(),
          middle_name: randFirstName(),
          person_type_id: rand(personTypesIds),
          contact_id: Number(newPersonContact.insertId)
        })
        .execute();
    } catch (error) {
      console.warn(error)
    }
  }))
}

export async function seedFeedbacks(db: Kysely<Database>) {
  const projects = await db.selectFrom("project").select(["id"]).execute();
  const persons = await db.selectFrom("person").select(["id"]).execute();
  const statuses = await db
    .selectFrom("feedback_status")
    .select(["id"])
    .execute();
  const types = await db.selectFrom("feedback_type").select(["id"]).execute();
  const topics = await db.selectFrom("feedback_topic").select(["id"]).execute();

  const projectIds = projects.map((p) => p.id);
  const personIds = persons.map((p) => p.id);
  const statusIds = statuses.map((s) => s.id);
  const typeIds = types.map((s) => s.id);
  const topicsIds = topics.map((s) => s.id);

  for (let i = 0; i < 30; i++) {
    await db
      .insertInto("feedback")
      .values({
        project_id: rand(projectIds),
        description: randProductDescription(),
        person_email_contact_id: rand(personIds),
        feedback_status_id: rand(statusIds),
        feedback_topic_id: rand(topicsIds),
        feedback_type_id: rand(typeIds),
      })
      .execute();
  }
}

seed("static");
