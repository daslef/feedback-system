import * as v from "valibot";

import { personContactSchema } from "./person_contact";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const stringSchema = v.string();

const personSchema = v.object({
  id: idSchema,
  first_name: stringSchema,
  last_name: stringSchema,
  middle_name: stringSchema,
  person_type_id: idSchema,
  contact_id: idSchema,
});

export const getPersonSchema = v.object({
  ...personSchema.entries,
  person_type: v.picklist(["citizen", "official", "moderator"]),
  ...v.omit(personContactSchema, ["id"]).entries,
});

export const getManyPersonsSchema = v.array(getPersonSchema);
export const createPersonSchema = v.object({
  first_name: stringSchema,
  last_name: stringSchema,
  middle_name: stringSchema,
  person_type_id: idSchema,
  email: stringSchema,
  phone: v.optional(v.string()),
  social: v.optional(v.string()),
});

export type PersonTable = v.InferInput<typeof personSchema>;
