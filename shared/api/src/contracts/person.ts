import { oc } from "@orpc/contract";
import * as v from "valibot";

import {
  getPersonSchema,
  getManyPersonsSchema,
  createPersonSchema,
  updatePersonSchema,
} from "@shared/schema/person";

import { baseInputAll, baseInputOne } from "@shared/schema/base";

const personContract = oc
  .tag("Persons")
  .prefix("/persons")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all persons",
        description: "Get information for all persons",
      })
      .input(baseInputAll)
      .output(getManyPersonsSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get a person",
        description: "Get person information by id",
      })
      .input(baseInputOne)
      .output(getPersonSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        summary: "Update a person",
        description: "Update person information by id",
        inputStructure: "detailed",
      })
      .input(
        v.object({
          body: updatePersonSchema,
          params: v.object({ id: v.string() }),
        }),
      )
      .output(getPersonSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New person",
        description: "Create a new person",
      })
      .input(createPersonSchema)
      .output(getPersonSchema),
  });

export default personContract;
