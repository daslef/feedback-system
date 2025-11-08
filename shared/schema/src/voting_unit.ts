import * as v from "valibot";
import { idSchema } from "./base/fields";
import { baseInputOne } from "./base/inputs";

export const votingUnitSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string(), v.nonEmpty()),
  voting_region_id: idSchema,
});

export const getVotingUnitSchema = v.object({
  id: idSchema,
  title: v.pipe(v.string()),
  voting_region_id: idSchema,
  voting_region: v.string(),
});

export const getManyVotingUnitSchema = v.array(
  getVotingUnitSchema,
);

export const createVotingUnitSchema = v.omit(votingUnitSchema, [
  "id",
]);

export const updateVotingUnitSchema = v.object({
  params: baseInputOne,
  body: v.partial(createVotingUnitSchema),
});


export type VotingUnitTable = v.InferOutput<
  typeof votingUnitSchema
>;
