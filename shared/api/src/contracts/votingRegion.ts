import { oc } from "@orpc/contract";

import { baseInputAll, baseInputOne } from "@shared/schema/base";
import {
  getVotingRegionSchema,
  getManyVotingRegionSchema,
  updateVotingRegionSchema,
  createVotingRegionSchema,
} from "@shared/schema/voting_region";

const votingRegionContract = oc
  .tag("Voting Regions")
  .prefix("/voting_regions")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all voting regions",
        description: "Get full information for all voting regions",
      })
      .input(baseInputAll)
      .output(getManyVotingRegionSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get a voting region",
        description: "Get voting region information by id",
      })
      .input(baseInputOne)
      .output(getVotingRegionSchema),

    update: oc
      .route({
        method: "PATCH",
        path: "/{id}",
        inputStructure: "detailed",
        summary: "Update voting region",
      })
      .input(updateVotingRegionSchema)
      .output(getVotingRegionSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create voting region",
      })
      .input(createVotingRegionSchema)
      .output(getVotingRegionSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Delete voting region by ID",
      })
      .input(baseInputOne),
  });

export default votingRegionContract;
