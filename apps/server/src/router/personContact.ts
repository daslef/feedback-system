import { publicProcedure, protectedProcedure } from "@shared/api";
import { db } from "@shared/database";

function getBaseQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("person_contact")
    .selectAll()
}

const personContactRouter = {
  all: publicProcedure.personContact.all.handler(async ({ context, input }) => {
    // TODO pagination by limit, offset
    const { offset, limit } = input;

    return await getBaseQuery(context.db).execute();
  }),

  one: publicProcedure.personContact.one.handler(
    async ({ context, input }) => {
      try {
        return await getBaseQuery(context.db).where("person_contact.id", '=', +input.id).executeTakeFirstOrThrow();
      } catch {
        throw new Error(`No such contact with ID ${input.id}`);
      }
    },
  ),

  create: protectedProcedure.personContact.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("person_contact")
          .values({ ...input, phone: input.phone ?? "", social: input.social ?? "" })
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

export default personContactRouter;
