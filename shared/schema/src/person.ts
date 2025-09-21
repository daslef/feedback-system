import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const stringSchema = v.string();

export const personSchema = v.object({
  id: idSchema,
  first_name: stringSchema,
  last_name: stringSchema,
  middle_name: stringSchema,
  person_type_id: idSchema,
  contact_id: idSchema,
});

export type PersonTable = v.InferInput<typeof personSchema>;
