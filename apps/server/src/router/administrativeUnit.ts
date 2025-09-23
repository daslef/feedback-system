import { publicProcedure, protectedProcedure } from "@shared/api";

const administrativeUnitRouter = {
  all: publicProcedure.administrativeUnit.all.handler(
    async ({ context, input }) => {
      // TODO pagination by limit, offset
      const { offset, limit, filter, sort, type, ids } = input;

      let query = context.db
        .selectFrom("administrative_unit")
        .innerJoin(
          "administrative_unit_type",
          "administrative_unit.unit_type_id",
          "administrative_unit_type.id",
        )
        .select([
          "administrative_unit.id",
          "administrative_unit.title",
          "administrative_unit_type.title as unit_type",
        ]);

      if (type) {
        query = query.where("administrative_unit_type.title", "=", type);
      }

      if (ids) {
        query = query.where(
          "administrative_unit.id",
          Array.isArray(ids) ? "in" : "=",
          ids,
        );
      }

      const result = await query.execute();
      context.resHeaders?.set("x-total-count", String(result.length));

      return await query.execute();
    },
  ),

  create: protectedProcedure.administrativeUnit.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("administrative_unit")
          .values(input)
          .executeTakeFirstOrThrow();

        return await context.db
          .selectFrom("administrative_unit")
          .innerJoin(
            "administrative_unit_type",
            "administrative_unit.id",
            "administrative_unit_type.id",
          )
          .select([
            "administrative_unit.id",
            "administrative_unit.title",
            "administrative_unit_type.title as unit_type",
          ])
          .where("id", "=", Number(insertId))
          .executeTakeFirstOrThrow();
      } catch {
        throw new Error("Error on create new administrative unit");
      }
    },
  ),
};

export default administrativeUnitRouter;
