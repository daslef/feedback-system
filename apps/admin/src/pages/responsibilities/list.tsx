import { useMany, useList } from "@refinedev/core";

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

import { Table, Space, Input, Select } from "antd";

export const ListResponsibilities = () => {
  // const {
  //   result,
  //   query: { isLoading },
  // } = useList({
  //   resource: "topic_category_topics",
  // });

  const { tableProps, sorters, filters } = useTable({
    resource: "official_responsibilities",
    pagination: { currentPage: 1, pageSize: 24 },
    sorters: {
      initial: [{ field: "official_id", order: "asc" }],
    },
  });

  const { result: administrativeUnits, query: administrativeUnitsQuery } =
    useMany({
      resource: "administrative_units",
      ids:
        tableProps?.dataSource?.map(
          (responsibility) => responsibility.administrative_unit_id,
        ) ?? [],
    });

  const { result: officials, query: personsQuery } = useMany({
    resource: "persons",
    ids:
      tableProps?.dataSource?.map(
        (responsibility) => responsibility.official_id,
      ) ?? [],
  });

  const { selectProps: administrativeUnitsSelectProps } = useSelect({
    resource: "administrative_units",
    pagination: {
      pageSize: 48,
    },
  });

  const { selectProps: personsSelectProps } = useSelect({
    resource: "persons",
    pagination: {
      pageSize: 48,
    },
  });

  return (
    <List title="Ответственные">
      <Table {...tableProps} rowKey="id" sticky={true}>
        <Table.Column
          dataIndex="official_id"
          title="Топик"
          sorter
          defaultSortOrder={getDefaultSortOrder("official_id", sorters)}
          render={(value) => {
            if (personsQuery.isLoading) {
              return "Загрузка...";
            }

            return officials?.data?.find((official) => official.id == value)
              ?.title;
          }}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => {
                return Number(selectedKey);
              }}
            >
              <Select style={{ minWidth: 200 }} {...personsSelectProps} />
            </FilterDropdown>
          )}
        />

        <Table.Column
          dataIndex="administrative_unit_id"
          title="Категория"
          sorter
          defaultSortOrder={getDefaultSortOrder(
            "administrative_unit_id",
            sorters,
          )}
          render={(value) => {
            if (administrativeUnitsQuery.isLoading) {
              return "Загрузка...";
            }

            return administrativeUnits?.data?.find((unit) => unit.id == value)
              ?.title;
          }}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => Number(selectedKey)}
            >
              <Select
                style={{ minWidth: 200 }}
                {...administrativeUnitsSelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "administrative_unit_id",
            filters,
          )}
        />

        <Table.Column
          title="Действия"
          render={(_, record) => (
            <EditButton hideText size="small" recordItemId={record.id} />
          )}
        />
      </Table>
    </List>
  );
};
