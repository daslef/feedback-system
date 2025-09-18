import { useOne, useUpdate } from "@refinedev/core";

export const EditProject = () => {
  const {
    result,
    query: { isLoading },
  } = useOne({ resource: "projects", id: 1 });

  const {
    mutate,
    mutation: { isPending: isUpdating },
  } = useUpdate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isUpdating) {
    return <div>Updating...</div>;
  }

  return (
    <>
      <div>{JSON.stringify(result)}</div>
      <button
        onClick={async () => {
           mutate({
            resource: "projects",
            id: 1,
            values: {
              title:
                "Общественное пространство у Городского Дома Культуры. II этап",
              administrative_unit_id: 1,
            },
          });
        }}
      >
        Change
      </button>
    </>
  );
};
