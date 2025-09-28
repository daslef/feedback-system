import * as v from "valibot";
import { idSchema } from "./base/fields";
import { baseInputOne } from "./base/inputs";

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

export const updateAdministrativeUnitSchema = v.object({
  params: baseInputOne,
  body: v.partial(createAdministrativeUnitSchema),
});

export const getManyAdministrativeUnitSchema = v.array(
  getAdministrativeUnitSchema,
);

export type AdministrativeUnitTable = v.InferOutput<
  typeof administrativeUnitSchema
>;
