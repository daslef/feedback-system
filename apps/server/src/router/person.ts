import { publicProcedure, protectedProcedure } from "@shared/api";
import { db } from "@shared/database";

function getBasePersonQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("person")
    .selectAll()
    .innerJoin("person_type", "person.person_type_id", "person_type.id")
    .select("person_type.title as person_type");
}

const personRouter = {
  all: publicProcedure.person.all.handler(async ({ context, input }) => {
    // TODO pagination by limit, offset
    const { offset, limit } = input;

    const persons = await getBasePersonQuery(context.db).execute();

    const personsExtended = await Promise.all(
      persons.map(async (person) => {
        const contact = await db
          .selectFrom("person_contact")
          .selectAll()
          .where("person_contact.id", "=", person.contact_id)
          .executeTakeFirstOrThrow();

        return {
          ...person,
          contact,
        };
      }),
    );

    return personsExtended;
  }),

  one: publicProcedure.person.one.handler(
    async ({ context, input, errors }) => {
      try {
        const person = await context.db
          .selectFrom("person")
          .selectAll()
          .innerJoin("person_type", "person.person_type_id", "person_type.id")
          .where("person.id", "=", +input.id)
          .select("person_type.title as person_type")
          .executeTakeFirstOrThrow();

        const personContact = await context.db
          .selectFrom("person_contact")
          .selectAll()
          .where("person_contact.id", "=", person.contact_id)
          .executeTakeFirstOrThrow();

        return {
          ...person,
          contact: personContact,
        };
      } catch (error) {
        console.error(error);
        throw errors.NOT_FOUND({
          message: `Персона с ID ${input.id} не найдена`,
        });
      }
    },
  ),

  create: protectedProcedure.person.create.handler(
    async ({ context, input, errors }) => {
      try {
        const { insertId } = await context.db
          .insertInto("person")
          .values(input)
          .executeTakeFirstOrThrow();

        const person = await getBasePersonQuery(context.db)
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();

        const personContact = await context.db
          .selectFrom("person_contact")
          .selectAll()
          .where("person_contact.id", "=", person.contact_id)
          .executeTakeFirstOrThrow();

        return {
          ...person,
          contact: personContact,
        };
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({ message: "Ошибка при создании новой персоны" });
      }
    },
  ),
};

export default personRouter;
