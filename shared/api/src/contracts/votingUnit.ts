import { oc } from "@orpc/contract";

import { baseInputAll, baseInputOne } from "@shared/schema/base";
import { getVotingUnitSchema, getManyVotingUnitSchema, updateVotingUnitSchema, createVotingUnitSchema } from "@shared/schema/voting_unit";

const votingUnitContract = oc
  .tag("Voting Units")
  .prefix("/voting_units")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all voting units",
        description: "Get full information for all voting units",
      })
      .input(baseInputAll)
      .output(getManyVotingUnitSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get an voting unit",
        description: "Get voting unit information by id",
      })
      .input(baseInputOne)
      .output(getVotingUnitSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Update voting unit",
      })
      .input(updateVotingUnitSchema)
      .output(getVotingUnitSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create voting unit",
      })
      .input(createVotingUnitSchema)
      .output(getVotingUnitSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Delete voting unit by ID",
      })
      .input(baseInputOne),
  });

export default votingUnitContract;
