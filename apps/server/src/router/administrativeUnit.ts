import { publicProcedure, protectedProcedure } from "@shared/api";

const administrativeUnitRouter = {
  all: publicProcedure.administrativeUnit.all.handler(
    async ({ context, input }) => {
      // TODO pagination by limit, offset
      const { offset, limit, type } = input;

      const administrativeUnits = context.db
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
        return await administrativeUnits
          .where("administrative_unit_type.title", "=", type)
          .execute();
      }

      return administrativeUnits.execute();
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
