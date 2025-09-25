import * as v from "valibot";
import { idSchema } from "./base/fields";

export const officialResponsibilitySchema = v.object({
  id: idSchema,
  administrative_unit_id: idSchema,
  official_id: idSchema,
});

export type OfficialResponsibilityTable = v.InferOutput<
  typeof officialResponsibilitySchema
>;
