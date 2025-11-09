import allVotingRegions from "./votingRegion.all";
import oneVotingRegion from "./votingRegion.one";
import updateVotingRegion from "./votingRegion.update";
import createVotingRegion from "./votingRegion.create";
import deleteVotingRegion from "./votingRegion.delete";

const votingRegionRouter = {
  all: allVotingRegions,
  create: createVotingRegion,
  one: oneVotingRegion,
  update: updateVotingRegion,
  delete: deleteVotingRegion
};

export default votingRegionRouter;
