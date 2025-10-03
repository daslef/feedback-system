import { protectedProcedure } from "@shared/api";
import { sendCitizenEmail, sendOfficialEmail } from "@shared/queue";
import _baseSelect from "./_baseSelect";
import _enrichSelect from "./_enrichSelect";

const updateFeedback = protectedProcedure.feedback.update.handler(
  async ({ context, input, errors }) => {
    const { params, body } = input;

    try {
      await context.db
        .updateTable("feedback")
        .set(body)
        .where("feedback.id", "=", Number(params.id))
        .executeTakeFirstOrThrow();

      const result = await _baseSelect(context.db)
        .where("feedback.id", "=", Number(params.id))
        .executeTakeFirstOrThrow();

      if (body.feedback_status_id) {
        const citizen = await context.db
          .selectFrom("person")
          .innerJoin("person_contact", "person_contact.id", "person.contact_id")
          .where("person.id", "=", result.person_id)
          .select(["email", "first_name", "last_name", "middle_name"])
          .executeTakeFirstOrThrow();

        const citizenFullName = citizen.middle_name
          ? `${citizen.first_name} ${citizen.middle_name}`
          : `${citizen.first_name}`;

        await sendCitizenEmail(
          citizen.email,
          citizenFullName,
          result.feedback_status === "approved",
        );
      }

      if (body.feedback_status_id && result.feedback_status === "approved") {
        const official = await context.db
          .selectFrom("official_responsibility")
          .innerJoin(
            "administrative_unit",
            "administrative_unit.id",
            "official_responsibility.administrative_unit_id",
          )
          .where("administrative_unit.title", "=", result.administrative_unit)
          .select("official_responsibility.official_id")
          .executeTakeFirst();

        if (official) {
          const officialContact = await context.db
            .selectFrom("person_contact")
            .innerJoin("person", "person.contact_id", "person_contact.id")
            .where("person.id", "=", official.official_id)
            .select([
              "person_contact.email",
              "person.first_name",
              "person.last_name",
              "person.middle_name",
            ])
            .executeTakeFirstOrThrow();

          const feedbackImages = await context.db
            .selectFrom("feedback_image")
            .innerJoin("feedback", "feedback_image.feedback_id", "feedback.id")
            .select(["feedback_image.link_to_s3", "feedback_image.feedback_id"])
            .where("feedback.id", "=", Number(result.id))
            .execute();

          const officialName = officialContact.middle_name
            ? `${officialContact.first_name} ${officialContact.middle_name}`
            : officialContact.first_name;

          const categoryTopic =
            result.topic !== null ? result.topic : undefined;

          await sendOfficialEmail({
            officialName,
            categoryTopic,
            description: result.description,
            email: officialContact.email,
            createdAt: result.created_at,
            files: (feedbackImages ?? []).map(({ link_to_s3 }) => link_to_s3),
          });
        }
      }

      const enrichedData = await _enrichSelect(context.db, {
        ...result,
        created_at: new Date(result.created_at).toISOString(),
      });

      return enrichedData;
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не удалось обновить запись с ID ${params.id}`,
      });
    }
  },
);

export default updateFeedback;
