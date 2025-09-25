import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

const personTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["citizen", "official", "moderator"]),
});

export const getPersonTypeSchema = personTypeSchema
export const getManyPersonTypeSchema = v.array(personTypeSchema);

export type PersonTypeTable = v.InferInput<typeof personTypeSchema>;
