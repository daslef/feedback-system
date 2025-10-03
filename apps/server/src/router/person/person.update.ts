import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";

const updatePerson = protectedProcedure.person.update.handler(
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

      const person = await _baseSelect(context.db)
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

      return await _baseSelect(context.db)
        .where("person.id", "=", Number(params.id))
        .executeTakeFirstOrThrow();
    } catch (error) {
      console.error(error);
      throw errors.CONFLICT({ message: "Ошибка при обновлении персоны" });
    }
  },
);

export default updatePerson;
