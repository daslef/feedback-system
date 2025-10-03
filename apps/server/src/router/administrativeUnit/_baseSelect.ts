import { db } from "@shared/database";

export default function _baseSelect(dbInstance: typeof db) {
  return dbInstance
    .selectFrom("administrative_unit")
    .innerJoin(
      "administrative_unit_type",
      "administrative_unit_type.id",
      "administrative_unit.unit_type_id",
    )
    .select([
      "administrative_unit.id as id",
      "administrative_unit.title as title",
      "administrative_unit.unit_type_id as unit_type_id",
      "administrative_unit_type.title as unit_type",
    ]);
}
