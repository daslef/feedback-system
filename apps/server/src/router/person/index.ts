import allPersons from "./person.all";
import onePerson from "./person.one";
import createPerson from "./person.create";
import updatePerson from "./person.update";

const personRouter = {
  all: allPersons,
  one: onePerson,
  create: createPerson,
  update: updatePerson,
};

export default personRouter;
