import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const projectSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
  latitude: v.number(),
  longitude: v.number(),
  year_of_completion: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(2010),
    v.maxValue(2026),
  ),
  administrative_unit_id: idSchema,
  created_at: v.pipe(v.string()),
});

export type ProjectTable = v.InferInput<typeof projectSchema>;
