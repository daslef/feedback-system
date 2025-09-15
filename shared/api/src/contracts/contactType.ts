import { oc } from "@orpc/contract";
import * as v from "valibot";

const ContactTypeSchema = v.object({
  id: v.pipe(v.number(), v.integer(), v.minValue(1)),
  title: v.string(),
});

const GetManyFeedbackTypeSchema = v.array(
  ContactTypeSchema,
);

const contactTypeContract = oc.tag("Contacts").prefix("/contact_types").router({
  all: oc
    .route({
      method: "GET",
      path: "/",
      summary: "List all contact types",
      description: "Get information for all contact types",
    })
    .output(GetManyFeedbackTypeSchema),
});

export default contactTypeContract;
