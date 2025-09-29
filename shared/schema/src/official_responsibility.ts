import * as v from "valibot";
import { idSchema } from "./base/fields";
import { baseInputOne } from "./base/inputs";

export const officialResponsibilitySchema = v.object({
  id: idSchema,
  administrative_unit_id: idSchema,
  official_id: idSchema,
});

export const getOfficialResponsibilitySchema = v.object({
  ...officialResponsibilitySchema.entries,
  administrative_unit: v.string(),
  official_first_name: v.string(),
  official_last_name: v.string(),
  official_middle_name: v.optional(v.string()),
});

export const getManyOfficialResponsibilitySchema = v.array(
  getOfficialResponsibilitySchema,
);

export const createOfficialResponsibilitySchema = v.omit(
  officialResponsibilitySchema,
  ["id"],
);

export const updateOfficialResponsibilitySchema = v.object({
  params: baseInputOne,
  body: v.partial(v.omit(officialResponsibilitySchema, ["id"])),
});

export const deleteOfficialResponsibilitySchema = v.object({
  params: baseInputOne,
});

export type OfficialResponsibilityTable = v.InferOutput<
  typeof officialResponsibilitySchema
>;
