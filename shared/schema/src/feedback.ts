import * as v from "valibot";
import { baseInputOne } from "./base/inputs";
import { idSchema } from "./base/fields";

const feedbackSchema = v.object({
  id: idSchema,
  project_id: idSchema,
  description: v.string(),
  feedback_type_id: idSchema,
  topic_id: v.nullable(idSchema),
  person_id: idSchema,
  feedback_status_id: idSchema,
  created_at: v.union([
    v.date(),
    v.pipe(v.string(), v.isoTimestamp()),
    v.pipe(v.string(), v.isoDateTime()),
  ]),
});

export const getFeedbackSchema = v.object({
  ...feedbackSchema.entries,
  topic: v.nullable(v.string()),
  project: v.string(),
  feedback_type: v.string(),
  feedback_status: v.picklist(["pending", "approved", "declined"]),
  image_links: v.optional(v.array(v.string()), []),
});

export const getManyFeedbackSchema = v.array(
  v.omit(getFeedbackSchema, ["image_links"]),
);

export const updateFeedbackSchema = v.object({
  params: baseInputOne,
  body: v.partial(
    v.pick(feedbackSchema, [
      "topic_id",
      "feedback_type_id",
      "feedback_status_id",
      "project_id",
    ]),
  ),
});

export const createFeedbackSchema = v.object({
  project_id: idSchema,
  description: v.string(),
  feedback_type_id: idSchema,

  topic_category_topic_id: v.optional(idSchema),

  first_name: v.string(),
  last_name: v.string(),
  middle_name: v.optional(v.string()),

  email: v.string(),
  phone: v.optional(v.string()),

  files: v.optional(
    v.union([
      v.array(
        v.pipe(v.file(), v.mimeType(["image/jpeg", "image/jpg", "image/png"])),
      ),
      v.pipe(v.file(), v.mimeType(["image/jpeg", "image/jpg", "image/png"])),
    ]),
  ),
});

export type FeedbackTable = v.InferOutput<typeof feedbackSchema>;
