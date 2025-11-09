import { publicProcedure } from "@shared/api";
import { type Database } from "@shared/database";
import _baseSelect from './_baseSelect';

const allVotingVotes = publicProcedure.votingVote.all.handler(
  async ({ context, input, errors }) => {
    try {
      const { offset, limit, filter, sort } = input;

      let query = _baseSelect(context.db)

      if (filter?.length) {
        const mapOperatorsToSql = {
          eq: "=",
          ne: "!=",
          lt: "<",
          gt: ">",
          in: "in",
        } as const;

        type WhereValue = string | number | string[] | number[];

        for (const filterExpression of filter) {
          const matchResult =
            decodeURI(filterExpression).match(/(.*)\[(.*)\](.*)/);

          if (matchResult === null) {
            continue;
          }

          let column = matchResult[1] as
            | keyof Database["voting_vote"]

          if (column === "id") {
            column =
              "voting_vote.id" as keyof Database["voting_vote"];
          }

          const operator = matchResult[2] as keyof typeof mapOperatorsToSql;

          let value: WhereValue = Number.isFinite(+matchResult[3])
            ? +matchResult[3]
            : matchResult[3];

          if (operator === "in" && typeof value === "string") {
            const items = value.split(",");
            value = items.some((item) => !Number.isFinite(+item))
              ? items
              : items.map(Number);
          } else if (operator === "in" && typeof value === "number") {
            value = Array.isArray(value) ? value : [value];
          }

          query = query.where(column, mapOperatorsToSql[operator], value);
        }
      }

      context.resHeaders?.set(
        "x-total-count",
        String((await query.execute()).length),
      );

      if (sort !== undefined) {
        for (const sortExpression of sort) {
          const [field, order] = sortExpression.split(".");
          query = query.orderBy(
            field as keyof Database["voting_vote"],
            order as "desc" | "asc",
          );
        }
      } else {
        query = query.orderBy("voting_vote.created_at", "desc");
      }

      if (limit !== undefined) {
        query = query.limit(limit);
      }

      if (offset !== undefined) {
        query = query.offset(offset);
      }

      return await query.execute();
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  },
);

export default allVotingVotes;
