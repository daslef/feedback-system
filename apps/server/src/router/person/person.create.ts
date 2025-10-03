import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const createPerson = protectedProcedure.person.create.handler(
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

      const person = await _baseSelect(context.db)
        .where("person.id", "=", Number(personId))
        .executeTakeFirstOrThrow();

      return person;
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({ message: "Ошибка при создании новой персоны" });
    }
  },
);

export default createPerson;
