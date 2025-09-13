import { db } from "@shared/database";
import { betterAuth } from "better-auth";
import { getBaseOptions } from "./server";

export const auth = betterAuth({
  ...getBaseOptions(db),
});
