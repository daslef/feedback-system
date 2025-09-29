import { publicProcedure } from "@shared/api";

const administrativeUnitTypeRouter = {
  all: publicProcedure.administrativeUnitType.all.handler(
    async ({ context, errors }) => {
      try {
        const unitTypes = await context.db
          .selectFrom("administrative_unit_type")
          .selectAll()
          .execute();
        return unitTypes;
      } catch (error) {
        console.error(error);
        throw errors.INTERNAL_SERVER_ERROR();
      }
    },
  ),
};

export default administrativeUnitTypeRouter;
