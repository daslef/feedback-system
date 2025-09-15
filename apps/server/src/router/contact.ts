import { publicProcedure, protectedProcedure } from "@shared/api";
import { db } from "@shared/database";

function getBaseQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("contact")
    .selectAll()
    .innerJoin(
      "contact_type",
      "contact_type.id",
      "contact.contact_type_id",
    )
    .select([
      "contact_type.title as contact_type",
    ]);
}

const contactRouter = {
  all: publicProcedure.contact.all.handler(async ({ context, input }) => {
    // TODO pagination by limit, offset
    const { offset, limit, person_id } = input;

    if (person_id) {
      return await getBaseQuery(context.db).where("contact.person_id", "=", person_id).execute()
    }

    return await getBaseQuery(context.db).execute();
  }),

  one: publicProcedure.contact.one.handler(
    async ({ context, input }) => {
      try {
        return await getBaseQuery(context.db).executeTakeFirstOrThrow();
      } catch {
        throw new Error(`No such contact with ID ${input.id}`);
      }
    },
  ),

  create: protectedProcedure.contact.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("contact")
          .values(input)
          .executeTakeFirstOrThrow();

        return await getBaseQuery(context.db)
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch {
        throw new Error("Error on create new contact");
      }
    },
  ),
};

export default contactRouter;
