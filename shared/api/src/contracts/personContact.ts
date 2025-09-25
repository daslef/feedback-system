import { oc } from "@orpc/contract";
import * as v from "valibot";

export const ContactSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  email: v.string(),
  phone: v.optional(v.string()),
  social: v.optional(v.string()),
});

const GetManyContactsSchema = v.array(ContactSchema);

const personContactContract = oc
  .tag("PersonContacts")
  .prefix("/person-contacts")
  .router({

    all: oc
      .route({
        method: "GET",
        path: "/",
        summary: "List all contacts",
        description: "Get information for all contacts with optional pagination",
      })
      .input(
        v.object({
          limit: v.optional(
            v.pipe(
              v.string(),
              v.transform(Number),
              v.number(),
              v.integer(),
              v.minValue(1),
              v.maxValue(100)
            )
          ),
          offset: v.optional(
            v.pipe(
              v.string(),
              v.transform(Number),
              v.number(),
              v.integer(),
              v.minValue(0)
            )
          ),
        })
      )
      .output(GetManyContactsSchema),

    one: oc
      .route({
        method: "GET",
        path: "/{id}",
        summary: "Get a contact",
        description: "Get contact information by ID",
      })
      .input(v.object({ id: v.string() }))
      .output(ContactSchema),

    create: oc
      .route({
        method: "POST",
        path: "/",
        summary: "Create a contact",
        description: "Create a new contact",
      })
      .input(v.omit(ContactSchema, ["id"]))
      .output(ContactSchema),

    update: oc
      .route({
        method: "PUT",
        path: "/{id}",
        summary: "Update a contact",
        description: "Update existing contact by ID",
      })
      .input(
        v.object({
          params: v.object({ id: v.string() }),
          body: v.omit(ContactSchema, ["id"]),
        })
      )
      .output(ContactSchema),

    delete: oc
      .route({
        method: "DELETE",
        path: "/{id}",
        summary: "Delete a contact",
        description: "Delete a contact by ID",
      })
      .input(v.object({ id: v.string() }))
      .output(v.object({ success: v.boolean() })),
  });

export default personContactContract;
