import allOfficialResponsibilities from "./officialResponsibility.all";
import createOfficialResponsibility from "./officialResponsibility.create";
import updateOfficialResponsibility from "./officialResponsibility.update";
import deleteOfficialResponsibility from "./officialResponsibility.delete";

const officialResponsibilityRouter = {
  all: allOfficialResponsibilities,
  create: createOfficialResponsibility,
  update: updateOfficialResponsibility,
  delete: deleteOfficialResponsibility,
};

export default officialResponsibilityRouter;
