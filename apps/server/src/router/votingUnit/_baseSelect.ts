import { db } from "@shared/database";

export default function _baseSelect(dbInstance: typeof db) {
  return dbInstance
    .selectFrom("voting_unit")
    .innerJoin(
      "voting_region",
      "voting_unit.voting_region_id",
      "voting_region.id",
    )
    .select([
      "voting_unit.id as id",
      "voting_unit.title as title",
      "voting_unit.voting_region_id",
      "voting_region.title as voting_region"
    ]);
}
