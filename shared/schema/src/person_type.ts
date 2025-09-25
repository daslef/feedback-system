import * as v from "valibot";
import { idSchema } from "./base/fields";

const personTypeSchema = v.object({
  id: idSchema,
  title: v.picklist(["citizen", "official", "moderator"]),
});

export const getPersonTypeSchema = personTypeSchema;
export const getManyPersonTypeSchema = v.array(personTypeSchema);

export type PersonTypeTable = v.InferOutput<typeof personTypeSchema>;
