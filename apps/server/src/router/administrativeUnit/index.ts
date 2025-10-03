import allAdministrativeUnits from "./administrativeUnit.all";
import createAdministrativeUnit from "./administrativeUnit.create";
import updateAdministrativeUnit from "./administrativeUnit.update";

const administrativeUnitRouter = {
  all: allAdministrativeUnits,
  create: createAdministrativeUnit,
  update: updateAdministrativeUnit,
};

export default administrativeUnitRouter;
