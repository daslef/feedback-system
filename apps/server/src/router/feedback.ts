import { publicProcedure, protectedProcedure } from "@shared/api";
import { db, type Database } from "@shared/database";

function prepareBaseQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("feedback")
    .innerJoin("project", "feedback.project_id", "project.id")
    .innerJoin("feedback_type", "feedback.feedback_type_id", "feedback_type.id")
    .innerJoin("topic", "feedback.topic_id", "topic.id")
    .innerJoin(
      "feedback_status",
      "feedback.feedback_status_id",
      "feedback_status.id",
    )
    .select([
      "feedback.id",
      "feedback.project_id",
      "project.title as project",
      "feedback.description",
      "feedback.feedback_type_id",
      "feedback_type.title as feedback_type",
      "feedback.topic_id",
      "topic.title as topic",
      "feedback.person_email_contact_id",
      "feedback.feedback_status_id",
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

        return await query.execute();
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

        return project;
      } catch (error) {
        console.error(error);
        throw errors.NOT_FOUND({
          message: `Не найдено записи с ID ${input.id}`,
        });
      }
    },
  ),

  // create: publicProcedure.feedback.create.handler(
  //   async ({ context, input, errors }) => {
  //     try {
  //       // TODO: add processing person data

  //       const { id: pendingStatusId } = await context.db
  //         .selectFrom("feedback_status")
  //         .select("id")
  //         .where("feedback_status.title", "=", "pending")
  //         .executeTakeFirstOrThrow();

  //       const { insertId } = await context.db
  //         .insertInto("feedback")
  //         .values({ ...input, feedback_status_id: pendingStatusId })
  //         .executeTakeFirstOrThrow();

  //       return await prepareBaseQuery(context.db)
  //         .where("id", "=", Number(insertId))
  //         .executeTakeFirstOrThrow();
  //     } catch (error) {
  //       console.error(error);
  //       throw errors.CONFLICT({
  //         message: `Ошибка при создании записи`,
  //       });
  //     }
  //   },
  // ),
};

export default feedbackRouter;
