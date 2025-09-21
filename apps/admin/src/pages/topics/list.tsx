import { useList } from "@refinedev/core";

export const ListFeedbackTopics = () => {
  const {
    result,
    query: { isLoading },
  } = useList({
    resource: "topics",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(result)}</div>;
};
