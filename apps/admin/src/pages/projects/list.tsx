import { useList } from "@refinedev/core";

export const ListProjects = () => {
  const {
    result,
    query: { isLoading },
  } = useList({
    resource: "projects",
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: [
      { field: "year_of_completion", order: "desc" },
      { field: "title", order: "asc" },
    ],
    filters: [
      {
        field: "administrative_unit_type",
        operator: "eq",
        value: "town",
      },
      {
        field: "year_of_completion",
        operator: "eq",
        value: "2023",
      },
    ],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(result)}</div>;
};
