import * as v from "valibot";
import { idSchema } from "./base/fields";

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

export type AdministrativeUnitTypeTable = v.InferOutput<
  typeof administrativeUnitTypeSchema
>;
