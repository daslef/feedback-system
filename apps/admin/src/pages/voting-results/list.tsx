import { useMany } from "@refinedev/core";
import {
  useTable,
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
  useSelect,
  List,
  DeleteButton,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Space from "antd/es/space";
import Select from "antd/es/select";

const ListVotingResults = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: "voting_votes",
    pagination: { currentPage: 1, pageSize: 24 },
    sorters: {
      initial: [
        { field: "created_at", order: "desc" },
      ],
    },
  });

  const { result: votingUnits, query: votingUnitsQuery } = useMany({
    resource: "voting_units",
    ids: tableProps?.dataSource?.map((record) => record.voting_unit_id) ?? [],
  });


  return (
    <List title="Голосование / Результаты">
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{ ...tableProps.pagination, pageSizeOptions: [12, 24, 48] }}
      >
        <Table.Column
          dataIndex="username"
          title="Пользователь"
          sorter
          render={(value) => value || "—"}
        />
        <Table.Column
          dataIndex="description"
          title="Описание"
          sorter
          defaultSortOrder={getDefaultSortOrder("description", sorters)}
          render={(value) => (
            <div
              style={{
                maxWidth: 300,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {value}
            </div>
          )}
        />
        <Table.Column
          dataIndex="voting_unit_id"
          title="Район"
          sorter
          render={(value) => {
            if (votingUnitsQuery.isLoading) {
              return "Загрузка...";
            }

            return votingUnits?.data?.find((unit) => unit.id == value)
              ?.voting_region;
          }}
        />
        <Table.Column
          dataIndex="voting_unit_id"
          title="Поселение"
          sorter
          render={(value) => {
            if (votingUnitsQuery.isLoading) {
              return "Загрузка...";
            }

            return votingUnits?.data?.find((unit) => unit.id == value)
              ?.title;
          }}
        />
        <Table.Column
          dataIndex="created_at"
          title="Дата создания"
          sorter
          defaultSortOrder={getDefaultSortOrder("created_at", sorters)}
          render={(value) => new Date(value).toLocaleDateString("ru-RU")}
        />
        <Table.Column
          title="Действия"
          minWidth={120}
          render={(_, record) => (
            <Space>
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default ListVotingResults;
