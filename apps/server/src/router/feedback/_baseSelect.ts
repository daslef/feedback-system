import { db } from "@shared/database";

export default function _baseSelect(databaseInstance: typeof db) {
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
