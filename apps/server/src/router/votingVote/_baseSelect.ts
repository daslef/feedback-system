import { db } from "@shared/database";

export default function _baseSelect(dbInstance: typeof db) {
  return dbInstance
    .selectFrom("voting_vote")
    .selectAll();
}
