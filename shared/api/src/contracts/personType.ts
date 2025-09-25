import { oc } from "@orpc/contract";

import { getManyPersonTypeSchema } from "@shared/schema/person_type";

const personTypeContract = oc
  .tag("Persons")
  .prefix("/person_types")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all person types",
        description: "Get information for all person types",
      })
      .output(getManyPersonTypeSchema),
  });

export default personTypeContract;
