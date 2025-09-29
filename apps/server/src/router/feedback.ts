import { publicProcedure, protectedProcedure } from "@shared/api";
import { db, type Database } from "@shared/database";
import upload from "@shared/upload";

function prepareBaseQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("feedback")
    .selectAll()
    .innerJoin("project", "feedback.project_id", "project.id")
    .leftJoin(
      "administrative_unit",
      "project.administrative_unit_id",
      "administrative_unit.id",
    )
    .innerJoin("feedback_type", "feedback.feedback_type_id", "feedback_type.id")
    .leftJoin(
      "topic_category_topic",
      "feedback.topic_id",
      "topic_category_topic.id",
    )
    .leftJoin("topic", "topic.id", "topic_category_topic.topic_id")
    .innerJoin(
      "feedback_status",
      "feedback.feedback_status_id",
      "feedback_status.id",
    )
    .select([
      "feedback.id",
      "feedback.project_id",
      "feedback.description",
      "feedback.feedback_type_id",
      "feedback.topic_id",
      "feedback.person_id",
      "feedback.feedback_status_id",
      "project.title as project",
      "administrative_unit.title as administrative_unit",
      "feedback_type.title as feedback_type",
      "topic.title as topic",
      "feedback_status.title as feedback_status",
      "feedback.created_at",
    ]);
}

const feedbackRouter = {
  all: protectedProcedure.feedback.all.handler(
    async ({ context, input, errors }) => {
      try {
        const { offset, limit, sort, filter } = input;

        let query = prepareBaseQuery(context.db);

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
              | keyof Database["feedback"]
              | keyof Database["topic"]
              | keyof Database["project"]
              | keyof Database["feedback_status"]
              | keyof Database["feedback_type"];

            if (column === "id") {
              column = "feedback.id" as keyof Database["feedback"];
            }

            if (column === "feedback_status_id") {
              column =
                "feedback.feedback_status_id" as keyof Database["feedback"];
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
            }

            query = query.where(column, mapOperatorsToSql[operator], value);
          }
        }

        if (sort !== undefined) {
          for (const sortExpression of sort) {
            const [field, order] = sortExpression.split(".");
            query = query.orderBy(
              field as keyof Database["feedback"],
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

        const results = await query.execute();

        return results.map((result) => ({
          ...result,
          created_at: new Date(result.created_at).toISOString(),
        }));
      } catch (error) {
        console.error(error);
        throw errors.INTERNAL_SERVER_ERROR();
      }
    },
  ),

  one: publicProcedure.feedback.one.handler(
    async ({ context, input, errors }) => {
      try {
        const project = await prepareBaseQuery(context.db)
          .where("feedback.id", "=", Number(input.id))
          .executeTakeFirstOrThrow();

        const feedbackImages = await context.db
          .selectFrom("feedback_image")
          .innerJoin("feedback", "feedback_image.feedback_id", "feedback.id")
          .select("feedback_image.link_to_s3")
          .where("feedback.id", "=", Number(input.id))
          .execute();

        return {
          ...project,
          created_at: new Date(project.created_at).toISOString(),
          image_links: feedbackImages.map(({ link_to_s3 }) => link_to_s3),
        };
      } catch (error) {
        console.error(error);
        throw errors.NOT_FOUND({
          message: `Не найдено записи с ID ${input.id}`,
        });
      }
    },
  ),

  update: protectedProcedure.feedback.update.handler(
    async ({ context, input, errors }) => {
      const { params, body } = input;

      try {
        await context.db
          .updateTable("feedback")
          .set(body)
          .where("feedback.id", "=", Number(params.id))
          .executeTakeFirstOrThrow();

        const result = await prepareBaseQuery(context.db)
          .where("feedback.id", "=", Number(params.id))
          .executeTakeFirstOrThrow();

        return {
          ...result,
          created_at: new Date(result.created_at).toISOString(),
        };
      } catch (error) {
        console.error(error);
        throw errors.NOT_FOUND({
          message: `Не удалось обновить запись с ID ${params.id}`,
        });
      }
    },
  ),

  create: publicProcedure.feedback.create.handler(
    async ({ context, input, errors }) => {
      const transaction = await context.db.startTransaction().execute();

      try {
        let personId = (
          await transaction
            .selectFrom("person")
            .innerJoin(
              "person_contact",
              "person.contact_id",
              "person_contact.id",
            )
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
          if (context.environment === "development") {
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

          if (context.environment === "development") {
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

        if (context.environment === "development") {
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
              const fileUrl = await upload(file, "photos");
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
  ),
};

export default feedbackRouter;
