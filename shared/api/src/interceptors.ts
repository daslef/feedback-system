import * as v from "valibot";

import { ORPCError } from "@orpc/client";
import { ValidationError } from "@orpc/contract";

export const onErrorInterceptor = (error: unknown) => {
  if (
    error instanceof ORPCError &&
    error.code === "BAD_REQUEST" &&
    error.cause instanceof ValidationError
  ) {
    const valiIssues = error.cause.issues as [
      v.BaseIssue<unknown>,
      ...v.BaseIssue<unknown>[],
    ];
    console.error(v.flatten(valiIssues));
    throw new ORPCError("INPUT_VALIDATION_FAILED", {
      status: 422,
      message: v.summarize(valiIssues),
      cause: error.cause,
    });
  }

  if (
    error instanceof ORPCError &&
    error.code === "INTERNAL_SERVER_ERROR" &&
    error.cause instanceof ValidationError
  ) {
    const valiIssues = error.cause.issues as [
      v.BaseIssue<unknown>,
      ...v.BaseIssue<unknown>[],
    ];
    console.error(v.flatten(valiIssues));

    throw new ORPCError("OUTPUT_VALIDATION_FAILED", {
      message: v.summarize(valiIssues),
      cause: error.cause,
    });
  }
};
