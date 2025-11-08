import * as v from "valibot";
import { idSchema } from "./base/fields";
import { baseInputOne } from "./base/inputs";

export const votingVoteSchema = v.object({
  id: idSchema,
  voting_unit_id: idSchema,
  username: v.pipe(v.string(), v.nonEmpty()),
  description: v.pipe(v.string(), v.nonEmpty()),
  created_at: v.union([
    v.date(),
    v.pipe(v.string(), v.isoTimestamp()),
    v.pipe(v.string(), v.isoDateTime()),
  ]),
});

export const getVotingVoteSchema = votingVoteSchema

export const createVotingVoteSchema = v.omit(votingVoteSchema, [
  "id",
]);

export const updateVotingVoteSchema = v.object({
  params: baseInputOne,
  body: v.partial(createVotingVoteSchema),
});

export const getManyVotingVoteSchema = v.array(
  getVotingVoteSchema,
);

export type VotingVoteTable = v.InferOutput<
  typeof votingVoteSchema
>;
