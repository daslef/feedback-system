import { publicProcedure, protectedProcedure } from "@shared/api"
import { db } from "@shared/database"

function getBasePersonQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("person")
    .selectAll()
    .innerJoin("person_type", "person.person_type_id", "person_type.id")
    .select("person_type.title as person_type")
}

const personRouter = {
  all: publicProcedure.person.all.handler(async ({ context, input }) => {
    const { offset, limit } = input
    const persons = await getBasePersonQuery(context.db)
      .limit(limit!)
      .offset(offset!)
      .execute()

    const personsExtended = await Promise.all(
      persons.map(async (person) => {
        const contact = await db
          .selectFrom("person_contact")
          .selectAll()
          .where("person_contact.id", "=", person.contact_id)
          .executeTakeFirstOrThrow()

        return {
          ...person,
          contact,
        }
      }),
    )

    return personsExtended
  }),

  one: publicProcedure.person.one.handler(async ({ context, input }) => {
    try {
      const person = await getBasePersonQuery(context.db)
        .where("person.id", "=", +input.id)
        .executeTakeFirstOrThrow()

      const contact = await db
        .selectFrom("person_contact")
        .selectAll()
        .where("person_contact.id", "=", person.contact_id)
        .executeTakeFirstOrThrow()

      return {
        ...person,
        contact,
      }
    } catch {
      throw new Error(`No such person with ID ${input.id}`)
    }
  }),

  create: protectedProcedure.person.create.handler(async ({ context, input }) => {
    try {
      const { insertId } = await context.db
        .insertInto("person")
        .values(input)
        .executeTakeFirstOrThrow()

      const person = await getBasePersonQuery(context.db)
        .where("person.id", "=", Number(insertId))
        .executeTakeFirstOrThrow()

      const contact = await db
        .selectFrom("person_contact")
        .selectAll()
        .where("person_contact.id", "=", person.contact_id)
        .executeTakeFirstOrThrow()

      return {
        ...person,
        contact,
      }
    } catch {
      throw new Error("Error on create new person")
    }
  }),

  update: protectedProcedure.person.update.handler(async ({ context, input }) => {
    try {
      await context.db
        .updateTable("person")
        .set(input.body)
        .where("id", "=", +input.params.id)
        .execute()

      const person = await getBasePersonQuery(context.db)
        .where("person.id", "=", +input.params.id)
        .executeTakeFirstOrThrow()

      const contact = await db
        .selectFrom("person_contact")
        .selectAll()
        .where("person_contact.id", "=", person.contact_id)
        .executeTakeFirstOrThrow()

      return {
        ...person,
        contact,
      }
    } catch {
      throw new Error(`Error on update person with ID ${input.params.id}`)
    }
  }),

  delete: protectedProcedure.person.delete.handler(async ({ context, input }) => {
    try {
      await context.db
        .deleteFrom("person")
        .where("id", "=", +input.id)
        .execute()

      return { success: true }
    } catch {
      throw new Error(`Error on delete person with ID ${input.id}`)
    }
  }),
}

export default personRouter
