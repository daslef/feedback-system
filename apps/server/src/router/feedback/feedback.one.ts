import { protectedProcedure } from "@shared/api";
import _baseSelect from "./_baseSelect";
import _enrichSelect from "./_enrichSelect";

const oneFeedback = protectedProcedure.feedback.one.handler(
  async ({ context, input, errors }) => {
    try {
      const feedback = await _baseSelect(context.db)
        .innerJoin("person", "person.id", "feedback.person_id")
        .innerJoin("person_contact", "person.contact_id", "person_contact.id")
        .select([
          "person_contact.email as person_email",
          "person_contact.phone as person_phone",
          "person.first_name as person_first_name",
          "person.last_name as person_last_name",
          "person.middle_name as person_middle_name",
        ])
        .where("feedback.id", "=", Number(input.id))
        .executeTakeFirstOrThrow();

      const feedbackImages = await context.db
        .selectFrom("feedback_image")
        .innerJoin("feedback", "feedback_image.feedback_id", "feedback.id")
        .select("feedback_image.link_to_s3")
        .where("feedback.id", "=", Number(input.id))
        .execute();

      const enrichedData = await _enrichSelect(context.db, {
        ...feedback,
        created_at: new Date(feedback.created_at).toISOString(),
      });

      return {
        ...enrichedData,
        image_links: feedbackImages.map(({ link_to_s3 }) => link_to_s3),
      };
    } catch (error) {
      console.error(error);
      throw errors.NOT_FOUND({
        message: `Не найдено записи с ID ${input.id}`,
      });
    }
  },
);

export default oneFeedback;
