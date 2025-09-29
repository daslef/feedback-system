import { publicProcedure, protectedProcedure } from "@shared/api";
import { db, type Database } from "@shared/database";

function getBasePersonQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("person")
    .innerJoin("person_type", "person.person_type_id", "person_type.id")
    .innerJoin("person_contact", "person.contact_id", "person_contact.id")
    .select([
      "person.id",
      "person.first_name",
      "person.last_name",
      "person.middle_name", 
      "person.person_type_id",
      "person.contact_id",
      "person_type.title as person_type",
      "person_contact.phone as phone",
      "person_contact.email as email",
      "person_contact.social as social",
    ]);
}

const personRouter = {
  all: publicProcedure.person.all.handler(
    async ({ context, input, errors }) => {
      try {
        const { offset, limit, sort, filter } = input;

        let query = getBasePersonQuery(context.db);

        if (filter?.length) {
          const mapOperatorsToSql = {
            eq: "=",
            ne: "!=",
            lt: "<",
            gt: ">",
            in: "in",
          } as const;

          type WhereValue = string | number | string[] | number[];

          for (const filterExpression of filter) {
            const matchResult =
              decodeURI(filterExpression).match(/(.*)\[(.*)\](.*)/);

            if (matchResult === null) {
              continue;
            }

            let column = matchResult[1] as
              | keyof Database["person_type"]
              | keyof Database["person"]
              | keyof Database["person_contact"];

            if (column === "id") {
              column = "person.id" as keyof Database["person"];
            }

            const operator = matchResult[2] as keyof typeof mapOperatorsToSql;

            let value: WhereValue = Number.isFinite(+matchResult[3])
              ? +matchResult[3]
              : matchResult[3];

            if (operator === "in" && typeof value === "string") {
              const items = value.split(",");
              value = items.some((item) => !Number.isFinite(+item))
                ? items
                : items.map(Number);
            } else if (operator === "in" && typeof value === "number") {
              value = Array.isArray(value) ? value : [value];
            }

            query = query.where(column, mapOperatorsToSql[operator], value);
          }
        }

        if (sort !== undefined) {
          for (const sortExpression of sort) {
            const [field, order] = sortExpression.split(".");
            query = query.orderBy(
              field as keyof Database["person"],
              order as "desc" | "asc",
            );
          }
        }

        const total = (await query.execute()).length;
        context.resHeaders?.set("x-total-count", String(total));

        if (limit !== undefined) {
          query = query.limit(limit);
        }

        if (offset !== undefined) {
          query = query.offset(offset);
        }

        return await query.execute();
      } catch (error) {
        console.error(error);
        throw errors.INTERNAL_SERVER_ERROR();
      }
    },
  ),

  one: publicProcedure.person.one.handler(
    async ({ context, input, errors }) => {
      try {
        const person = await getBasePersonQuery(context.db)
          .where("person.id", "=", +input.id)
          .executeTakeFirstOrThrow();

        return person;
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
        const { email, phone, social, ...personInput } = input;

        const { id: personContactId } = await context.db
          .insertInto("person_contact")
          .values({
            email: email,
            phone: phone ?? "",
            social: social ?? "",
          })
          .returning("id")
          .executeTakeFirstOrThrow();

        if (personContactId === undefined) {
          throw new Error("Ошибка при создании нового контакта");
        }

        const { id: personId } = await context.db
          .insertInto("person")
          .values({
            ...personInput,
            contact_id: Number(personContactId),
          })
          .returning("id")
          .executeTakeFirstOrThrow();

        const person = await getBasePersonQuery(context.db)
          .where("person.id", "=", Number(personId))
          .executeTakeFirstOrThrow();

        return person;
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({ message: "Ошибка при создании новой персоны" });
      }
    },
  ),

  update: protectedProcedure.person.update.handler(
    async ({ context, input, errors }) => {
      try {
        const { body, params } = input;
        const { email, phone, social, ...personInput } = body;

        const personUpdateEntries = Object.entries(personInput).filter(
          ([_, value]) => value !== undefined,
        );

        if (personUpdateEntries.length) {
          await context.db
            .updateTable("person")
            .set(Object.fromEntries(personUpdateEntries))
            .where("person.id", "=", Number(params.id))
            .execute();
        }

        const person = await getBasePersonQuery(context.db)
          .where("person.id", "=", Number(params.id))
          .executeTakeFirstOrThrow();

        const contactUpdateEntries = Object.entries({
          email,
          phone,
          social,
        }).filter(([_, value]) => value !== undefined);

        if (contactUpdateEntries.length) {
          await context.db
            .updateTable("person_contact")
            .set(Object.fromEntries(contactUpdateEntries))
            .where("person_contact.id", "=", person.contact_id)
            .execute();
        }

        return await getBasePersonQuery(context.db)
          .where("person.id", "=", Number(params.id))
          .executeTakeFirstOrThrow();
      } catch (error) {
        console.error(error);
        throw errors.CONFLICT({ message: "Ошибка при обновлении персоны" });
      }
    },
  ),
};

export default personRouter;
