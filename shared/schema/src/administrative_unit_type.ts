import * as v from "valibot"

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1))

export const administrativeUnitTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["settlement", "town"]),
})

export type AdministrativeUnitTypeTable = v.InferInput<typeof administrativeUnitTypeSchema>
