import { useOne } from "@refinedev/core";

export const ShowProject = () => {
  const {
    result,
    query: { isLoading },
  } = useOne({ resource: "projects", id: 1 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(result)}</div>;
};
