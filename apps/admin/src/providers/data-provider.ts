import type {
  CrudFilters,
  CrudSorting,
  DataProvider,
  LogicalFilter,
} from "@refinedev/core";

const API_URL = "http://localhost:3000/api";

import { createAuthClient } from "@shared/auth";

const authClient = createAuthClient({
  apiBasePath: "/api",
  apiBaseUrl: "http://localhost:3000",
});

const fetcher = async (url: string, options?: RequestInit) => {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options?.headers,
    },
  });
};

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id, meta }) => {
    const response = await fetcher(`${API_URL}/${resource}/${id}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const response = await fetcher(`${API_URL}/${resource}/${id}`, {
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

    const response = await fetcher(
      `${API_URL}/${resource}?${params.toString()}`,
    );

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();
    const total = Number(response.headers.get("x-total-count")) || 0;

    return {
      data,
      total,
    };
  },
  getMany: async ({ resource, ids, meta }) => {
    const params = new URLSearchParams();

    if (ids) {
      ids.forEach((id) => params.append("ids", String(id)));
    }

    const response = await fetcher(
      `${API_URL}/${resource}?${params.toString()}`,
    );

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  create: async ({ resource, variables }) => {
    const response = await fetcher(`${API_URL}/${resource}`, {
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
  // createMany: () => { /* ... */ },
  // deleteMany: () => { /* ... */ },
  // updateMany: () => { /* ... */ },
  // custom: () => { /* ... */ },
};
