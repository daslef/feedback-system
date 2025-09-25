import * as v from "valibot";

import { idSchema } from "./base/fields";
import { personContactSchema } from "./person_contact";

const personSchema = v.object({
  id: idSchema,
  first_name: v.string(),
  last_name: v.string(),
  middle_name: v.string(),
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
  first_name: v.string(),
  last_name: v.string(),
  middle_name: v.string(),
  person_type_id: idSchema,
  email: v.string(),
  phone: v.optional(v.string()),
  social: v.optional(v.string()),
});

export const updatePersonSchema = v.partial(
  v.object({
    ...createPersonSchema.entries,
    contact_id: idSchema,
  }),
);

export type PersonTable = v.InferOutput<typeof personSchema>;
