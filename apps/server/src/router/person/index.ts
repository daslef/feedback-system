import allPersons from "./person.all";
import onePerson from "./person.one";
import createPerson from "./person.create";
import updatePerson from "./person.update";
import deletePerson from "./person.delete";

const personRouter = {
  all: allPersons,
  one: onePerson,
  create: createPerson,
  update: updatePerson,
  delete: deletePerson,
};

export default personRouter;
