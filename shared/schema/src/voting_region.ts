import * as v from "valibot";
import { idSchema } from "./base/fields";

const votingRegionSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
});

export const getVotingRegionSchema = votingRegionSchema;

export const getManyVotingRegionSchema = v.array(
  getVotingRegionSchema,
);

export const createVotingRegionSchema = v.omit(getVotingRegionSchema, ["id"]);

export const updateVotingRegionSchema = v.object({
  body: v.omit(getVotingRegionSchema, ["id"]),
  params: v.object({ id: v.string() }),
})

export type VotingRegionTable = v.InferOutput<
  typeof votingRegionSchema
>;
