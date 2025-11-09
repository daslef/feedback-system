import allVotingVotes from "./votingVote.all";
import oneVotingVote from "./votingVote.one";
import createVotingVote from "./votingVote.create";
import deleteVotingVote from "./votingVote.delete";

const votingUnitRouter = {
  all: allVotingVotes,
  create: createVotingVote,
  one: oneVotingVote,
  delete: deleteVotingVote
};

export default votingUnitRouter;
