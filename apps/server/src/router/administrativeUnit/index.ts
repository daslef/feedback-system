import allAdministrativeUnits from "./administrativeUnit.all";
import createAdministrativeUnit from "./administrativeUnit.create";
import updateAdministrativeUnit from "./administrativeUnit.update";
import deleteAdministrativeUnit from "./administrativeUnit.delete";
import oneAdministrativeUnit from "./administrativeUnit.one";

const administrativeUnitRouter = {
  all: allAdministrativeUnits,
  create: createAdministrativeUnit,
  update: updateAdministrativeUnit,
  delete: deleteAdministrativeUnit,
  one: oneAdministrativeUnit
};

export default administrativeUnitRouter;
