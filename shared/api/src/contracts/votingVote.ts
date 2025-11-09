import { oc } from "@orpc/contract";

import { baseInputAll, baseInputOne } from "@shared/schema/base";
import { getVotingVoteSchema, createVotingVoteSchema, getManyVotingVoteSchema } from "@shared/schema/voting_vote";

const votingVoteContract = oc
  .tag("Voting Vote")
  .prefix("/voting_votes")
  .router({
    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List vote records",
        description: "Get information for all vote records",
      })
      .input(baseInputAll)
      .output(getManyVotingVoteSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get an voting unit",
        description: "Get voting unit information by id",
      })
      .input(baseInputOne)
      .output(getVotingVoteSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "New vote record",
        description: "Create a vote record",
      })
      .input(createVotingVoteSchema)
      .output(getVotingVoteSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Delete vote record by ID",
      })
      .input(baseInputOne),

  });

export default votingVoteContract;
