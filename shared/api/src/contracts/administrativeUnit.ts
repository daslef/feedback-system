import { oc } from "@orpc/contract";

import { baseInputAll } from "@shared/schema/base";
import {
  getAdministrativeUnitSchema,
  createAdministrativeUnitSchema,
  getManyAdministrativeUnitSchema,
} from "@shared/schema/administrative_unit";

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
      .input(baseInputAll)
      .output(getManyAdministrativeUnitSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New administrative unit",
        description: "Create a new administrative unit",
      })
      .input(createAdministrativeUnitSchema)
      .output(getAdministrativeUnitSchema),
  });

export default administrativeUnitContract;
