import * as z from "zod";

export const ProjectSchema = z.object({
  id: z.coerce.number().int().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  year_of_completion: z.int().min(2010).max(2026),
  administrative_unit_id: z.int(),
  title: z.string(),
});
