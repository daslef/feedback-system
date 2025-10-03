import allProjects from "./project.all";
import updateProject from "./project.update";
import createProject from "./project.create";
import oneProject from "./project.one";
import deleteProject from "./project.delete";

const projectRouter = {
  all: allProjects,
  update: updateProject,
  one: oneProject,
  create: createProject,
  delete: deleteProject,
};

export default projectRouter;
