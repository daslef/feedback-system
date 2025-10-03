import { db } from "@shared/database";

export default function _baseSelect(dbInstance: typeof db) {
  return dbInstance
    .selectFrom("official_responsibility")
    .innerJoin(
      "administrative_unit",
      "administrative_unit.id",
      "official_responsibility.administrative_unit_id",
    )
    .innerJoin("person", "person.id", "official_responsibility.official_id")
    .select([
      "official_responsibility.id",
      "official_responsibility.official_id",
      "official_responsibility.administrative_unit_id",
      "administrative_unit.title as administrative_unit",
      "person.first_name as official_first_name",
      "person.last_name as official_last_name",
      "person.middle_name as as official_middle_name",
    ]);
}
