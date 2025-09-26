import * as v from "valibot";
import { idSchema } from "./base/fields";

export const personContactSchema = v.object({
  id: idSchema,
  email: v.string(),
  phone: v.optional(v.string()),
  social: v.optional(v.nullable(v.string())),
});

export type PersonContactTable = v.InferOutput<typeof personContactSchema>;
