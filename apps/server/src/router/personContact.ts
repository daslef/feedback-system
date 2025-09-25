import { publicProcedure, protectedProcedure } from "@shared/api"
import { db } from "@shared/database"

function getBaseQuery(databaseInstance: typeof db) {
  return databaseInstance.selectFrom("person_contact").selectAll()
}

const personContactRouter = {
  all: publicProcedure.personContact.all.handler(async ({ context, input }) => {
    const { offset, limit } = input
    return await getBaseQuery(context.db)
      .limit(limit!)
      .offset(offset!)
      .execute()
  }),

  one: publicProcedure.personContact.one.handler(async ({ context, input }) => {
    try {
      return await getBaseQuery(context.db)
        .where("person_contact.id", "=", +input.id)
        .executeTakeFirstOrThrow()
    } catch {
      throw new Error(`No such contact with ID ${input.id}`)
    }
  }),

  create: protectedProcedure.personContact.create.handler(async ({ context, input }) => {
    try {
      const { insertId } = await context.db
        .insertInto("person_contact")
        .values({
          ...input,
          phone: input.phone ?? "",
          social: input.social ?? "",
        })
        .executeTakeFirstOrThrow()

      return await getBaseQuery(context.db)
        .where("id", "=", Number(insertId))
        .executeTakeFirstOrThrow()
    } catch {
      throw new Error("Error on create new contact")
    }
  }),

  update: protectedProcedure.personContact.update.handler(async ({ context, input }) => {
    try {
      await context.db
        .updateTable("person_contact")
        .set(input.body)
        .where("id", "=", +input.params.id)
        .execute()

      return await getBaseQuery(context.db)
        .where("id", "=", +input.params.id)
        .executeTakeFirstOrThrow()
    } catch {
      throw new Error(`Error on update contact with ID ${input.params.id}`)
    }
  }),

  delete: protectedProcedure.personContact.delete.handler(async ({ context, input }) => {
    try {
      await context.db
        .deleteFrom("person_contact")
        .where("id", "=", +input.id)
        .execute()

      return { success: true }
    } catch {
      throw new Error(`Error on delete contact with ID ${input.id}`)
    }
  }),
}

export default personContactRouter
