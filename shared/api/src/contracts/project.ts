import { oc } from "@orpc/contract";
import * as v from "valibot";

import { projectSchema } from "@shared/schema/project";
import { baseInputAll, baseInputOne } from "@shared/schema/base";

const CreateProjectSchema = v.omit(projectSchema, ["id", "created_at"]);
const UpdateProjectSchema = v.partial(CreateProjectSchema);

const GetProjectSchema = v.object({
  ...projectSchema.entries,
  administrative_unit: v.string(),
  administrative_unit_type: v.string(),
});

const GetManyProjectsSchema = v.array(GetProjectSchema);

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
      .input(baseInputOne)
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
        spec: (spec) => ({
          ...spec,
          parameters: [
            ...(spec.parameters || []),
            {
              name: "sort",
              in: "query",
              examples: {
                "one sorting": {
                  description: "One sorting rule",
                  value: "year_of_completion.desc",
                },
                "multiple sortings": {
                  description: "Multiple sorting rules",
                  value: "year_of_completion.desc&title.asc",
                },
              },
            },
            {
              name: "filter",
              in: "query",
              examples: {
                "one filter": {
                  description: "One filter rule",
                  value: "year_of_completion[eq]2023",
                },
                "multiple filters": {
                  description: "One filter rule",
                  value:
                    "year_of_completion[eq]2023&administrative_unit_type[ne]town",
                },
              },
            },
          ],
        }),
      })
      .input(
        v.object({
          ...baseInputAll.entries,
          administrative_unit_type: v.optional(
            v.picklist(["settlement", "town"]),
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
      .input(CreateProjectSchema)
      .output(GetProjectSchema),
  });

export default projectContract;
