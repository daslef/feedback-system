import * as v from "valibot";

export const baseLimitInput = v.optional(
  v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.integer(),
    v.minValue(12),
    v.maxValue(24),
  ),
);

export const baseOffsetInput = v.optional(
  v.pipe(
    v.string(),
    v.transform(Number),
    v.number(),
    v.integer(),
    v.minValue(0),
  ),
);

export const baseSortInput = v.optional(
  v.union([
    v.pipe(
      v.string(),
      v.transform((s) => decodeURI(s).split("&")),
      v.array(v.string()),
    ),
    v.array(
      v.pipe(
        v.string(),
        v.transform((s) => decodeURI(s)),
      ),
    ),
  ]),
);

export const baseFilterInput = v.optional(
  v.union([
    v.pipe(
      v.string(),
      v.transform((s) => decodeURI(s).split("&")),
      v.array(v.string()),
    ),
    v.array(
      v.pipe(
        v.string(),
        v.transform((s) => decodeURI(s)),
      ),
    ),
  ]),
);

const baseGetAll = v.object({
  limit: baseLimitInput,
  sort: baseSortInput,
  filter: baseFilterInput,
  offset: baseOffsetInput,
  administrative_unit_type: v.optional(v.picklist(["settlement", "town"])),
});

export { baseGetAll };
