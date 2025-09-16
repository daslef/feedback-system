import { oc } from "@orpc/contract";
import * as v from "valibot";

export const ContactSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  email: v.string(),
  phone: v.optional(v.string()),
  social: v.optional(v.string()),
});

const GetManyContactsSchema = v.array(ContactSchema);

const contactContract = oc
  .tag("Contacts")
  .prefix("/contacts")
  .router({
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
        }),
      )
      .output(GetManyContactsSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get a contact",
        description: "Get contact information by id",
      })
      .input(v.object({ id: v.string() }))
      .output(ContactSchema),

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
