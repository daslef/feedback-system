import { oc } from "@orpc/contract";
import * as v from "valibot";

const AdministrativeUnitSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
  unit_type_id: v.number(),
});

const GetAdministrativeUnitSchema = v.intersect([
  v.omit(AdministrativeUnitSchema, ["unit_type_id"]),
  v.object({
    unit_type: v.union([v.literal("settlement"), v.literal("town")]),
  }),
]);

const GetManyAdministrativeUnitsSchema = v.array(GetAdministrativeUnitSchema);

const administrativeUnitContract = oc.tag("Administrative Units").prefix("/administrative_units").router({
  all: oc
    .route({
      method: "GET",
      path: "/",
      summary: "List all administrative units",
      description: "Get full information for all administrative_units",
    })
    .input(
      v.object({
        limit: v.optional(
          v.pipe(
            v.string(),
            v.transform(Number),
            v.number(),
            v.integer(),
            v.minValue(10),
            v.maxValue(25),
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
    .input(v.omit(AdministrativeUnitSchema, ["id"]))
    .output(GetAdministrativeUnitSchema),
});

export default administrativeUnitContract;
