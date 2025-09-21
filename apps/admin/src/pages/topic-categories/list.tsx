import { useList } from "@refinedev/core";

export const ListTopicCategories = () => {
  const {
    result,
    query: { isLoading },
  } = useList({
    resource: "topic_categories",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(result)}</div>;
};
