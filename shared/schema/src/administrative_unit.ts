import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const administrativeUnitSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string()),
  unit_type_id: idSchema,
});

export const getAdministrativeUnitSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string()),
  unit_type_id: idSchema,
  unit_type: v.string(),
});

export const createAdministrativeUnitSchema = v.omit(administrativeUnitSchema, [
  "id",
]);

export const getManyAdministrativeUnitSchema = v.array(
  getAdministrativeUnitSchema,
);

export type AdministrativeUnitTable = v.InferInput<
  typeof administrativeUnitSchema
>;
