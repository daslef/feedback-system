import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const administrativeUnitTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["town", "settlement"]),
});

export const getAdministrativeUnitTypeSchema = administrativeUnitTypeSchema;

export const getManyAdministrativeUnitTypeSchema = v.array(
  getAdministrativeUnitTypeSchema,
);

export type AdministrativeUnitType = v.InferOutput<
  typeof administrativeUnitTypeSchema
>;

export type AdministrativeUnitTypeTable = v.InferInput<
  typeof administrativeUnitTypeSchema
>;
