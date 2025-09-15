import { oc } from "@orpc/contract";
import * as v from "valibot";

const PersonSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  first_name: v.string(),
  last_name: v.string(),
  middle_name: v.string(),
  person_type_id: v.pipe(v.number(), v.integer(), v.minValue(1))
});

const GetPersonSchema = v.intersect([
  PersonSchema,
  v.object({
    person_type: v.union([v.literal("citizen"), v.literal("official"), v.literal("moderator")]),
  }),
]);

const GetManyPersonsSchema = v.array(GetPersonSchema);

const personContract = oc.tag("Persons").prefix("/persons").router({
  all: oc
    .route({
      method: "GET",
      path: "/",
      summary: "List all persons",
      description: "Get information for all persons",
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
    .output(GetManyPersonsSchema),

  one: oc.route({
    method: "GET",
    path: "/{id}",
    summary: "Get a person",
    description: "Get person information by id",
  })
    .input(v.object({ id: v.string() }))
    .output(GetPersonSchema),

  create: oc
    .route({
      method: "POST",
      path: "/",
      summary: "New person",
      description: "Create a new person",
    })
    .input(v.omit(PersonSchema, ["id"]))
    .output(GetPersonSchema),
});

export default personContract;
