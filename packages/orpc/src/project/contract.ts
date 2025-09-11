import z from "zod";
import { oc } from "@orpc/contract";

import { ProjectSchema } from "./schema";

export const listProjectContract = oc
  .route({ method: "GET", path: "/projects" })
  .input(
    z.object({
      limit: z.number().int().min(1).max(50).optional(),
      cursor: z.number().int().min(0).default(0),
    }),
  )
  .output(z.array(ProjectSchema));

export const findProjectContract = oc
  .route({ method: "GET", path: "/projects/{id}" })
  .input(ProjectSchema.pick({ id: true }))
  .output(ProjectSchema);

export const createProjectContract = oc
  .route({ method: "POST", path: "/projects" })
  .input(ProjectSchema.omit({ id: true }))
  .output(ProjectSchema);

export const deleteProjectContract = oc
  .route({ method: "DELETE", path: "/projects/{id}" })
  .input(ProjectSchema.pick({ id: true }))
  .output(ProjectSchema.pick({ id: true }));

export const projectContract = {
  project: {
    list: listProjectContract,
    find: findProjectContract,
    create: createProjectContract,
    delete: deleteProjectContract,
  },
};
