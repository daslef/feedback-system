import { oc } from "@orpc/contract";
import * as v from "valibot";

import {
  getProjectSchema,
  getManyProjectsSchema,
  createProjectSchema,
  updateProjectSchema,
} from "@shared/schema/project";

import { baseInputAll, baseInputOne } from "@shared/schema/base";

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
      .output(getProjectSchema),

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
          body: updateProjectSchema,
          params: v.object({ id: v.string() }),
        }),
      )
      .output(getProjectSchema),

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
      .input(baseInputAll)
      .output(getManyProjectsSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New project",
        description: "Create a new project",
      })
      .input(createProjectSchema)
      .output(getProjectSchema),
  });

export default projectContract;
