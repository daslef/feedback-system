import { useTable, useMany } from "@refinedev/core";

export const ListProjects = () => {
  const {
    result,
    tableQuery: { isLoading },
    currentPage,
    setCurrentPage,
    pageCount,
    sorters,
    setSorters,
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

  const onPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onNext = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPage = (page: number) => {
    setCurrentPage(page);
  };

  const getSorter = (
    field: "title" | "administrative_unit" | "year_of_completion",
  ) => {
    const sorter = sorters?.find((sorter) => sorter.field === field);

    if (sorter) {
      return sorter.order;
    }
  };

  const onSort = (
    field: "title" | "administrative_unit" | "year_of_completion",
  ) => {
    const sorter = getSorter(field);

    setSorters(
      sorter === "desc"
        ? []
        : [
            {
              field,
              order: sorter === "asc" ? "desc" : "asc",
            },
          ],
    );
  };

  const indicator = { asc: "⬆️", desc: "⬇️" };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th onClick={() => onSort("title")}>
              Название{" "}
              {getSorter("title") &&
                indicator[getSorter("title") as keyof typeof indicator]}
            </th>
            <th onClick={() => onSort("administrative_unit")}>
              Город / Поселение{" "}
              {getSorter("administrative_unit") &&
                indicator[
                  getSorter("administrative_unit") as keyof typeof indicator
                ]}
            </th>
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
      <div className="pagination">
        <button type="button" onClick={onPrevious}>
          {"<"}
        </button>
        <div style={{ display: "inline-block" }}>
          {currentPage - 1 > 0 && (
            <span onClick={() => onPage(currentPage - 1)}>
              {currentPage - 1}
            </span>
          )}
          <span style={{ fontWeight: "bold" }}>{currentPage}</span>
          {currentPage + 1 <= pageCount && (
            <span onClick={() => onPage(currentPage + 1)}>
              {currentPage + 1}
            </span>
          )}
        </div>
        <button type="button" onClick={onNext}>
          {">"}
        </button>
      </div>
    </>
  );
};
