import { implement } from "@orpc/server";
import { ORPCError } from "@orpc/server";
import { projectContract } from "./contract";
import { db } from "@shared/database";
// import { publicProcedure } from "../lib/orpc";

const os = implement(projectContract);

const list = os.project.list.handler(async () => {
  return await db.selectFrom("project").selectAll().execute();
});

const find = os.project.find.handler(async ({ input }) => {
  try {
    return await db
      .selectFrom("project")
      .selectAll()
      .where("id", "=", input.id)
      .executeTakeFirstOrThrow();
  } catch (_) {
    throw new ORPCError("NOT_FOUND");
  }
});

const create = os.project.create.handler(async ({ input }) => {
  try {
    return await db
      .insertInto("project")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch {
    throw new ORPCError("CONFLICT");
  }
});

const delete_ = os.project.delete.handler(async ({ input }) => {
  try {
    return await db
      .deleteFrom("project")
      .where("id", "=", input.id)
      .returning("id")
      .executeTakeFirstOrThrow();
  } catch {
    throw new ORPCError("NOT_FOUND");
  }
});

export const projectRouter = {
  list,
  find,
  create,
  delete: delete_,
};
