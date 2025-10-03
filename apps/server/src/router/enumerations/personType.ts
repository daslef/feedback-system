import { publicProcedure } from "@shared/api";

const personTypeRouter = {
  all: publicProcedure.personType.all.handler(async ({ context }) => {
    const personTypes = await context.db
      .selectFrom("person_type")
      .selectAll()
      .execute();

    return personTypes;
  }),
};

export default personTypeRouter;
