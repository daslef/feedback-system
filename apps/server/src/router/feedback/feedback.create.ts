import { publicProcedure } from "@shared/api";
import { upload } from "@shared/minio";

const createFeedback = publicProcedure.feedback.create.handler(
  async ({ context, input, errors }) => {
    const transaction = await context.db.startTransaction().execute();

    try {
      let personId = (
        await transaction
          .selectFrom("person")
          .innerJoin("person_contact", "person.contact_id", "person_contact.id")
          .select("person.id")
          .where("person_contact.email", "=", input.body.email)
          .executeTakeFirst()
      )?.id;

      if (!personId) {
        const { id: personTypeId } = await transaction
          .selectFrom("person_type")
          .select("person_type.id")
          .where("person_type.title", "=", "citizen")
          .executeTakeFirstOrThrow();

        let personContactId;
        if (context.environment.ENV === "development") {
          const { insertId } = await transaction
            .insertInto("person_contact")
            .values({
              email: input.body.email,
              phone: input.body.phone ?? "",
            })
            .executeTakeFirstOrThrow();
          personContactId = insertId;
        } else {
          const { id } = await transaction
            .insertInto("person_contact")
            .values({
              email: input.body.email,
              phone: input.body.phone ?? "",
            })
            .returning("id")
            .executeTakeFirstOrThrow();
          personContactId = id;
        }

        if (personContactId === undefined) {
          throw new Error("Ошибка при создании нового контакта");
        }

        const newPersonValues = {
          first_name: input.body.first_name,
          last_name: input.body.last_name,
          middle_name: input.body.middle_name ?? "",
          person_type_id: personTypeId,
          contact_id: Number(personContactId),
        };

        if (context.environment.ENV === "development") {
          const { insertId } = await transaction
            .insertInto("person")
            .values(newPersonValues)
            .executeTakeFirstOrThrow();
          personId = Number(insertId);
        } else {
          const { id } = await transaction
            .insertInto("person")
            .values(newPersonValues)
            .returning("id")
            .executeTakeFirstOrThrow();
          personId = Number(id);
        }
      }

      const { id: pendingStatusId } = await transaction
        .selectFrom("feedback_status")
        .select("id")
        .where("feedback_status.title", "=", "pending")
        .executeTakeFirstOrThrow();

      const newFeedbackValues = {
        project_id: input.body.project_id,
        description: input.body.description,
        feedback_type_id: input.body.feedback_type_id,
        topic_id: input.body.topic_category_topic_id ?? null,
        person_id: personId,
        feedback_status_id: pendingStatusId,
      };

      let feedbackId;

      if (context.environment.ENV === "development") {
        const { insertId } = await transaction
          .insertInto("feedback")
          .values(newFeedbackValues)
          .executeTakeFirstOrThrow();
        feedbackId = insertId;
      } else {
        const { id } = await transaction
          .insertInto("feedback")
          .values(newFeedbackValues)
          .returning("id")
          .executeTakeFirstOrThrow();
        feedbackId = id;
      }

      if (feedbackId === undefined) {
        throw new Error("Ошибка при создании записи");
      }

      const images = [];
      if (input.body.files && Array.isArray(input.body.files)) {
        images.push(...input.body.files);
      } else if (input.body.files) {
        images.push(input.body.files);
      }

      await Promise.all(
        images.map(async (file) => {
          try {
            const fileUrl = await upload(file, "photos", context.environment);
            await transaction
              .insertInto("feedback_image")
              .values({
                feedback_id: Number(feedbackId),
                link_to_s3: fileUrl,
              })
              .execute();
          } catch {
            throw new Error("Error on images upload");
          }
        }),
      );

      await transaction.commit().execute();
    } catch (error) {
      await transaction.rollback().execute();
      console.error(error);
      throw errors.CONFLICT({
        message: `Ошибка при создании записи`,
      });
    }
  },
);

export default createFeedback;
