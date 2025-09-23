import { oc } from "@orpc/contract";
import * as v from "valibot";

import { baseInputAll } from "@shared/schema/base";
import { administrativeUnitSchema } from "@shared/schema/administrative_unit";

const CreateAdministrativeUnitSchema = v.omit(administrativeUnitSchema, ["id"]);

const GetAdministrativeUnitSchema = v.intersect([
  administrativeUnitSchema,
  v.object({
    unit_type: v.union([v.literal("settlement"), v.literal("town")]),
  }),
]);

const GetManyAdministrativeUnitsSchema = v.array(GetAdministrativeUnitSchema);

const administrativeUnitContract = oc
  .tag("Administrative Units")
  .prefix("/administrative_units")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all administrative units",
        description: "Get full information for all administrative_units",
      })
      .input(
        v.object({
          ...baseInputAll.entries,
          type: v.optional(v.picklist(["town", "settlement"])),
        }),
      )
      .output(GetManyAdministrativeUnitsSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New administrative unit",
        description: "Create a new administrative unit",
      })
      .input(CreateAdministrativeUnitSchema)
      .output(GetAdministrativeUnitSchema),
  });

export default administrativeUnitContract;
