import type {
  CrudFilters,
  CrudSorting,
  DataProvider,
  LogicalFilter,
} from "@refinedev/core";

const API_URL = "http://localhost:3000/api";

const getValueByPath = (item: Record<string, unknown>, path: string) => {
  const segments = path.split(".");
  let current: unknown = item;

  for (const segment of segments) {
    if (
      current !== null &&
      typeof current === "object" &&
      segment in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return current;
};

const applyFilters = (data: unknown[], filters?: CrudFilters) => {
  if (!filters || filters.length === 0) return data;

  return data.filter((item) => {
    if (typeof item !== "object" || item === null) return false;

    return filters.every((filter) => {
      if (!("field" in filter)) return true;
      const logicalFilter = filter as LogicalFilter;
      if (logicalFilter.operator !== "eq") return true;
      const value = getValueByPath(
        item as Record<string, unknown>,
        logicalFilter.field,
      );
      return value === logicalFilter.value;
    });
  });
};

const applySorters = (data: unknown[], sorters?: CrudSorting) => {
  if (!sorters || sorters.length === 0) return data;

  return [...data].sort((a, b) => {
    if (
      typeof a !== "object" ||
      typeof b !== "object" ||
      a === null ||
      b === null
    ) {
      return 0;
    }

    for (const sorter of sorters) {
      const aValue = getValueByPath(a as Record<string, unknown>, sorter.field);
      const bValue = getValueByPath(b as Record<string, unknown>, sorter.field);

      if (aValue === bValue) continue;

      const direction = sorter.order === "asc" ? 1 : -1;

      if (aValue == null) return -1 * direction;
      if (bValue == null) return 1 * direction;

      const aComparable =
        typeof aValue === "number"
          ? aValue
          : String(aValue).toLocaleLowerCase();
      const bComparable =
        typeof bValue === "number"
          ? bValue
          : String(bValue).toLocaleLowerCase();

      if (aComparable < bComparable) return -1 * direction;
      if (aComparable > bComparable) return 1 * direction;
    }

    return 0;
  });
};

const applyPagination = (
  data: unknown[],
  pagination?: { current?: number; pageSize?: number },
) => {
  if (!pagination || !pagination.current || !pagination.pageSize) {
    return data;
  }

  const start = (pagination.current - 1) * pagination.pageSize;
  return data.slice(start, start + pagination.pageSize);
};

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id, meta }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams();

    if (pagination && pagination.currentPage && pagination.pageSize) {
      params.append(
        "offset",
        String((pagination.currentPage - 1) * pagination.pageSize),
      );
      params.append("limit", String(pagination.pageSize));
    }

    if (sorters && sorters.length > 0) {
      for (const sorter of sorters) {
        params.append("sort", `${sorter.field}.${sorter.order}`);
      }
    }

    if (filters && filters.length > 0) {
      for (const filter of filters) {
        if ("field" in filter && filter.operator === "eq") {
          params.append("filter", `${filter.field}[eq]${filter.value}`);
        }
      }
    }

    const queryString = params.toString();
    const url = `${API_URL}/${resource}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    if (Array.isArray(data) && resource === "persons") {
      const filtered = applyFilters(data, filters);
      const sorted = applySorters(filtered, sorters);
      const total = sorted.length;
      const paginated = applyPagination(sorted, {
        current: pagination?.currentPage,
        pageSize: pagination?.pageSize,
      });

      return {
        data: paginated,
        total,
      };
    }

    const totalHeader = response.headers.get("X-Total-Count");
    const total = totalHeader
      ? Number(totalHeader)
      : Array.isArray(data)
        ? data.length
        : 0;

    return {
      data,
      total,
    };
  },
  create: async ({ resource, variables }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  deleteOne: () => {
    throw new Error("Not implemented");
  },
  getApiUrl: () => API_URL,
  // Optional methods:
  // getMany: () => { /* ... */ },
  // createMany: () => { /* ... */ },
  // deleteMany: () => { /* ... */ },
  // updateMany: () => { /* ... */ },
  // custom: () => { /* ... */ },
};
