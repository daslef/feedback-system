import { oc } from "@orpc/contract";
import * as v from "valibot";

const ContactSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  value: v.string(),
  contact_type_id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  person_id: v.pipe(v.number(), v.integer(), v.minValue(1))
});

const GetContactSchema = v.intersect([
  ContactSchema,
  v.object({
    contact_type: v.union([v.literal("phone"), v.literal("email"), v.literal("social")]),
  }),
]);

const GetManyContactsSchema = v.array(GetContactSchema);

const contactContract = oc.tag("Contacts").prefix("/contacts").router({
  all: oc
    .route({
      method: "GET",
      path: "/",
      summary: "List all contacts",
      description: "Get information for all contacts",
    })
    .input(
      v.object({
        limit: v.optional(
          v.pipe(
            v.string(),
            v.transform(Number),
            v.number(),
            v.integer(),
            v.minValue(10),
            v.maxValue(25),
          ),
        ),
        offset: v.optional(
          v.pipe(
            v.string(),
            v.transform(Number),
            v.number(),
            v.integer(),
            v.minValue(0),
          ),
        ),
        person_id: v.optional(v.pipe(v.string(), v.transform(Number), v.number(), v.integer(), v.minValue(1)))
      }),
    )
    .output(GetManyContactsSchema),

  one: oc.route({
    method: "GET",
    path: "/{id}",
    summary: "Get a contact",
    description: "Get contact information by id",
  })
    .input(v.object({ id: v.string() }))
    .output(GetContactSchema),

  create: oc
    .route({
      method: "POST",
      path: "/",
      summary: "New contact",
      description: "Create a new contact",
    })
    .input(v.omit(ContactSchema, ["id"]))
    .output(ContactSchema),
});

export default contactContract;
