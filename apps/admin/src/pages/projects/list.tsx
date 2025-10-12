import { useMany } from "@refinedev/core";
import {
  useTable,
  EditButton,
  ShowButton,
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
  useSelect,
  List,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Select from "antd/es/select";
import Space from "antd/es/space";

const ListProjects = () => {
  const { tableProps, sorters, filters } = useTable({
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: {
      initial: [
        { field: "year_of_completion", order: "desc" },
        { field: "title", order: "asc" },
      ],
    },
    filters: {
      initial: [],
    },
  });

  const { result: administrativeUnits, query } = useMany({
    resource: "administrative_units",
    ids:
      tableProps?.dataSource?.map(
        (project) => project.administrative_unit_id,
      ) ?? [],
  });

  const { selectProps: administrativeUnitSelectProps } = useSelect({
    resource: "administrative_units",
    pagination: {
      pageSize: 48,
    },
    defaultValue: getDefaultFilter("administrative_unit_id", filters, "eq"),
  });

  return (
    <List title="Реализованные проекты" breadcrumb={null}>
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          ...tableProps.pagination,
          hideOnSinglePage: true,
          pageSizeOptions: [12, 24, 48],
        }}
      >
        <Table.Column
          dataIndex="title"
          title="Название"
          sorter
          defaultSortOrder={getDefaultSortOrder("title", sorters)}
        />
        <Table.Column
          dataIndex={"administrative_unit_id"}
          title="Поселение"
          sorter
          render={(value) => {
            if (query.isLoading) {
              return "Загрузка...";
            }

            return administrativeUnits?.data?.find((unit) => unit.id == value)
              ?.title;
          }}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => {
                if (Array.isArray(selectedKey)) return undefined;
                return selectedKey && selectedKey !== ""
                  ? Number(selectedKey)
                  : undefined;
              }}
            >
              <Select
                style={{ minWidth: 200 }}
                {...administrativeUnitSelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "administrative_unit_id",
            filters,
            "eq",
          )}
        />
        <Table.Column
          dataIndex="year_of_completion"
          title="Год реализации"
          sorter
          defaultSortOrder={getDefaultSortOrder("year_of_completion", sorters)}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => {
                if (Array.isArray(selectedKey)) return undefined;
                return selectedKey && selectedKey !== ""
                  ? Number(selectedKey)
                  : undefined;
              }}
            >
              <Select style={{ minWidth: 200 }} />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "year_of_completion",
            filters,
            "eq",
          )}
        />
        <Table.Column dataIndex="latitude" title="Широта" />
        <Table.Column dataIndex="longitude" title="Долгота" />
        <Table.Column
          title="Действия"
          minWidth={120}
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <EditButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default ListProjects;
