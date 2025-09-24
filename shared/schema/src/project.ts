import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const projectSchema = v.object({
  id: v.optional(idSchema),
  title: v.pipe(v.string(), v.nonEmpty()),
  latitude: v.pipe(v.number(), v.minValue(-90), v.maxValue(90)),
  longitude: v.pipe(v.number(), v.minValue(-180), v.maxValue(180)),
  year_of_completion: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(2010),
    v.maxValue(2026),
  ),
  administrative_unit_id: idSchema,
  created_at: v.optional(v.string()),
});

export const getProjectSchema = v.object({
  ...projectSchema.entries,
  administrative_unit: v.string(),
  administrative_unit_type: v.string(),
});

export const getManyProjectsSchema = v.array(getProjectSchema);
export const createProjectSchema = v.omit(projectSchema, ["id", "created_at"]);
export const updateProjectSchema = v.partial(createProjectSchema);

export type ProjectTable = v.InferInput<typeof projectSchema>;
