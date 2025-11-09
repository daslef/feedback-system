import allVotingUnits from "./votingUnit.all";
import oneVotingUnit from "./votingUnit.one";
import updateVotingUnit from "./votingUnit.update";
import createVotingUnit from "./votingUnit.create";
import deleteVotingUnit from "./votingUnit.delete";

const votingUnitRouter = {
  all: allVotingUnits,
  create: createVotingUnit,
  one: oneVotingUnit,
  update: updateVotingUnit,
  delete: deleteVotingUnit
};

export default votingUnitRouter;
