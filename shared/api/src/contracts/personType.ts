import { oc } from "@orpc/contract";
import * as v from "valibot";

const PersonTypeSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
});

const GetManyPersonTypeSchema = v.array(PersonTypeSchema);

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
      .output(GetManyPersonTypeSchema),
  });

export default personTypeContract;
