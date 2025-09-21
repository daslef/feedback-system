import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const officialResponsibilitySchema = v.object({
  id: idSchema,
  administrative_unit_id: idSchema,
  official_id: idSchema,
});

export type OfficialResponsibilityTable = v.InferInput<
  typeof officialResponsibilitySchema
>;
