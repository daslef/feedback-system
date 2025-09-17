import * as v from "valibot"

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1))

export const administrativeUnitSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
  unit_type_id: idSchema
})

export type AdministrativeUnitTable = v.InferInput<typeof administrativeUnitSchema>