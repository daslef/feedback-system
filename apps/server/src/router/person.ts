import { publicProcedure, protectedProcedure } from "@shared/api";
import { db } from "@shared/database";

function getBaseQuery(databaseInstance: typeof db) {
  return databaseInstance.selectFrom("person")
    .selectAll()
    .innerJoin(
      "person_type",
      "person.person_type_id",
      "person_type.id",
    )
    .select("person_type.title as person_type")

}

const personRouter = {
  all: publicProcedure.person.all.handler(
    async ({ context, input }) => {
      // TODO pagination by limit, offset
      const { offset, limit } = input;

      const persons = await getBaseQuery(context.db)
        .execute();

      return persons;
    },
  ),

  one: publicProcedure.person.one.handler(
    async ({ context, input }) => {
      try {
        const person = await getBaseQuery(context.db).executeTakeFirstOrThrow();
        return person;
      } catch {
        throw new Error(`No such person with ID ${input.id}`);
      }
    },
  ),


  create: protectedProcedure.person.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("person")
          .values(input)
          .executeTakeFirstOrThrow();

        return await getBaseQuery(context.db)
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch {
        throw new Error("Error on create new person");
      }
    },
  ),
};

export default personRouter;
