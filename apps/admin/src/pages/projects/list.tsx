import { useTable, useMany } from "@refinedev/core";

export const ListProjects = () => {
  const {
    result,
    tableQuery: { isLoading },
  } = useTable({
    resource: "projects",
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: {
      initial: [
        { field: "year_of_completion", order: "desc" },
        { field: "title", order: "asc" },
      ],
    },
    filters: {
      initial: [
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
    },
  });

  const { result: administrativeUnits } = useMany({
    resource: "administrative_units",
    ids: result?.data?.map((project) => project.administrative_unit_id) ?? [],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Город / Поселение</th>
          <th>Год реализации</th>
          <th>Геопозиция</th>
        </tr>
      </thead>
      <tbody>
        {result?.data?.map((project) => (
          <tr key={project.id}>
            <td>{project.id}</td>
            <td>{project.title}</td>
            <td>
              {
                administrativeUnits?.data?.find(
                  (unit) => unit.id == project.administrative_unit_id,
                )?.title
              }
            </td>
            <td>{project.year_of_completion}</td>
            <td>{`${project.latitude}, ${project.longitude}`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
