import { oc } from "@orpc/contract";

import { getManyAdministrativeUnitTypeSchema } from "@shared/schema/administrative_unit_type";

const administrativeUnitTypeContract = oc
  .tag("Administrative Units")
  .prefix("/administrative_unit_types")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all administrative unit types",
        description: "Get information for all administrative unit types",
      })
      .output(getManyAdministrativeUnitTypeSchema),
  });

export default administrativeUnitTypeContract;
