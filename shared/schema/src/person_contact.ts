import * as v from "valibot";

const idSchema = v.pipe(v.number(), v.integer(), v.minValue(1));

export const personContactSchema = v.object({
  id: idSchema,
  email: v.string(),
  phone: v.string(),
  social: v.string(),
});

export type PersonContactTable = v.InferInput<typeof personContactSchema>;
