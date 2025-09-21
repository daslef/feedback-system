import { useList } from "@refinedev/core";

export const ListTopicCategoryTopics = () => {
  const {
    result,
    query: { isLoading },
  } = useList({
    resource: "topic_category_topics",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(result)}</div>;
};
