import { oc } from "@orpc/contract";
import * as v from "valibot";

const ProjectSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
  latitude: v.pipe(v.number(), v.minValue(-90), v.maxValue(90)),
  longitude: v.pipe(v.number(), v.minValue(-180), v.maxValue(180)),
  year_of_completion: v.pipe(
    v.number(),
    v.integer(),
    v.minValue(2010),
    v.maxValue(2026),
  ),
  administrative_unit_id: v.pipe(v.number(), v.integer()),
  created_at: v.pipe(v.string()),
});

const UpdateProjectSchema = v.partial(ProjectSchema);

const GetManyProjectsSchema = v.array(ProjectSchema);
const GetProjectSchema = v.intersect([
  v.omit(ProjectSchema, ["administrative_unit_id"]),
  v.object({ administrative_unit: v.string() }),
]);

const projectContract = oc
  .tag("Projects")
  .prefix("/projects")
  .router({
    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get a project",
        description: "Get full project information by id",
      })
      .input(v.object({ id: v.string() }))
      .output(GetProjectSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        summary: "Update a project",
        description: "Update project information by id",
        inputStructure: "detailed",
      })
      .input(
        v.object({
          body: UpdateProjectSchema,
          params: v.object({ id: v.string() }),
        }),
      )
      .output(GetProjectSchema),

    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all projects",
        description: "Get brief information for all projects",
      })
      .input(
        v.object({
          limit: v.optional(
            v.pipe(
              v.string(),
              v.transform(Number),
              v.number(),
              v.integer(),
              v.minValue(12),
              v.maxValue(24),
            ),
          ),
          offset: v.optional(
            v.pipe(
              v.string(),
              v.transform(Number),
              v.number(),
              v.integer(),
              v.minValue(0),
            ),
          ),
          administrative_unit_type: v.optional(
            v.union([v.literal("settlement"), v.literal("town")]),
          ),
        }),
      )
      .output(GetManyProjectsSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New project",
        description: "Create a new project",
      })
      .input(v.omit(ProjectSchema, ["id"]))
      .output(GetProjectSchema),
  });

export default projectContract;
