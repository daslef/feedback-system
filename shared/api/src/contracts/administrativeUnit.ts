import { oc } from "@orpc/contract";

import { baseInputAll, baseInputOne } from "@shared/schema/base";
import {
  getAdministrativeUnitSchema,
  createAdministrativeUnitSchema,
  updateAdministrativeUnitSchema,
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

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get an administrative unit",
        description: "Get administrative unit information by id",
      })
      .input(baseInputOne)
      .output(getAdministrativeUnitSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Update administrative unit",
      })
      .input(updateAdministrativeUnitSchema)
      .output(getAdministrativeUnitSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create administrative unit",
      })
      .input(createAdministrativeUnitSchema)
      .output(getAdministrativeUnitSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Delete administrative unit by ID",
      })
      .input(baseInputOne),
  });

export default administrativeUnitContract;
