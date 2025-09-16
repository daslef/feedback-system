import { publicProcedure, protectedProcedure } from "@shared/api";
import { db } from "@shared/database";

function prepareBaseQuery(databaseInstance: typeof db) {
  return databaseInstance
    .selectFrom("feedback")
    .innerJoin("project", "feedback.project_id", "project.id")
    .innerJoin("feedback_type", "feedback.feedback_type_id", "feedback_type.id")
    .innerJoin(
      "feedback_topic",
      "feedback.feedback_topic_id",
      "feedback_topic.id",
    )
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
      "feedback.feedback_topic_id",
      "feedback_topic.title as feedback_topic",
      "feedback.person_email_contact_id",
      "feedback.feedback_status_id",
      "feedback_status.title as feedback_status",
      "feedback.created_at",
    ]);
}

const feedbackRouter = {
  all: publicProcedure.feedback.all.handler(async ({ context, input }) => {
    // TODO pagination by limit, offset
    // const { offset, limit } = input;

    const feedbackRecords = await prepareBaseQuery(context.db).execute();

    return feedbackRecords;
  }),

  one: publicProcedure.feedback.one.handler(async ({ context, input }) => {
    try {
      const project = await prepareBaseQuery(context.db)
        .where("feedback.id", "=", +input.id)
        .executeTakeFirstOrThrow();

      return project;
    } catch {
      throw new Error(`No feedback record with ID ${input.id}`);
    }
  }),

  create: protectedProcedure.feedback.create.handler(
    async ({ context, input }) => {
      try {
        const { id: pendingStatusId } = await context.db
          .selectFrom("feedback_status")
          .select("id")
          .where("feedback_status.title", "=", "pending")
          .executeTakeFirstOrThrow();

        const { insertId } = await context.db
          .insertInto("feedback")
          .values({ ...input, feedback_status_id: pendingStatusId })
          .executeTakeFirstOrThrow();

        return await prepareBaseQuery(context.db)
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch {
        throw new Error("Error on create feedback record");
      }
    },
  ),
};

export default feedbackRouter;
