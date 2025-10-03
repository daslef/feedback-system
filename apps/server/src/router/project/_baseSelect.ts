import { db } from "@shared/database";

const _baseSelect = (dbInstance: typeof db) => {
  return dbInstance
    .selectFrom("project")
    .innerJoin(
      "administrative_unit",
      "administrative_unit.id",
      "project.administrative_unit_id",
    )
    .innerJoin(
      "administrative_unit_type",
      "administrative_unit_type.id",
      "administrative_unit.unit_type_id",
    )
    .select([
      "project.id",
      "project.title as title",
      "project.latitude",
      "project.longitude",
      "project.year_of_completion",
      "project.administrative_unit_id",
      "administrative_unit.title as administrative_unit",
      "administrative_unit_type.title as administrative_unit_type",
      "project.created_at",
    ]);
};

export default _baseSelect;
