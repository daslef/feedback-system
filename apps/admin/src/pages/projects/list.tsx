import { useList } from "@refinedev/core";

export const ListProjects = () => {
  const {
    result,
    query: { isLoading },
  } = useList({
    resource: "projects",
    pagination: { currentPage: 1, pageSize: 12 },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(result)}</div>;
};
