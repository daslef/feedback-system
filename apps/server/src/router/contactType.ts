import { publicProcedure } from "@shared/api";

const contactTypeRouter = {
  all: publicProcedure.contactType.all.handler(
    async ({ context }) => {
      const contactTypes = await context.db
        .selectFrom("contact_type")
        .selectAll()
        .execute();

      return contactTypes;
    },
  ),
};

export default contactTypeRouter;
