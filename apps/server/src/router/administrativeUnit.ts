import { publicProcedure, protectedProcedure } from "@shared/api"

const administrativeUnitRouter = {
  all: publicProcedure.administrativeUnit.all.handler(
    async ({ context, input }) => {
      const { offset, limit, type } = input

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
        ])

      if (type) {
        query = query.where("administrative_unit_type.title", "=", type)
      }

      return await query
        .limit(limit!)
        .offset(offset!)
        .execute()
    },
  ),

  one: publicProcedure.administrativeUnit.one.handler(
    async ({ context, input }) => {
      try {
        const administrativeUnit = await context.db
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
          ])
          .where("administrative_unit.id", "=", +input.id)
          .executeTakeFirstOrThrow()

        return administrativeUnit
      } catch {
        throw new Error(`No such administrative unit with ID ${input.id}`)
      }
    },
  ),

  create: protectedProcedure.administrativeUnit.create.handler(
    async ({ context, input }) => {
      try {
        const { insertId } = await context.db
          .insertInto("administrative_unit")
          .values(input)
          .executeTakeFirstOrThrow()

        return await context.db
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
          ])
          .where("administrative_unit.id", "=", Number(insertId))
          .executeTakeFirstOrThrow()
      } catch {
        throw new Error("Error on create new administrative unit")
      }
    },
  ),

  update: publicProcedure.administrativeUnit.update.handler(
    async ({ context, input }) => {
      try {
        await context.db
          .updateTable("administrative_unit")
          .set(input.body)
          .where("administrative_unit.id", "=", +input.params.id)
          .execute()

        return await context.db
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
          ])
          .where("administrative_unit.id", "=", +input.params.id)
          .executeTakeFirstOrThrow()
      } catch {
        throw new Error(`Error on update administrative unit with ID ${input.params.id}`)
      }
    },
  ),

  delete: protectedProcedure.administrativeUnit.delete.handler(
    async ({ context, input }) => {
      try {
        await context.db
          .deleteFrom("administrative_unit")
          .where("administrative_unit.id", "=", +input.id)
          .execute()

        return { success: true, message: "Administrative unit deleted successfully" }
      } catch {
        throw new Error(`Error on delete administrative unit with ID ${input.id}`)
      }
    },
  ),
}

export default administrativeUnitRouter