import * as z from "zod";

export const ProjectSchema = z.object({
  id: z.coerce.number().min(1),
  latitude: z.float32(),
  longitude: z.float32(),
  year_of_completion: z.int(),
  administrative_unit_id: z.int(),
  project_type_id: z.int(),
  title: z.string(),
});
