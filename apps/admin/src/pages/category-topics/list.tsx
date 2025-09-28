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

export const ListTopicCategoryTopics = () => {
  // const {
  //   result,
  //   query: { isLoading },
  // } = useList({
  //   resource: "topic_category_topics",
  // });

  const { tableProps, sorters, filters } = useTable({
    resource: "topic_category_topics",
    pagination: { currentPage: 1, pageSize: 48 },
    sorters: {
      initial: [{ field: "topic_category_id", order: "asc" }],
    },
  });

  const { result: topics, query: topicsQuery } = useMany({
    resource: "topics",
    ids: tableProps?.dataSource?.map((tct) => tct.topic_id) ?? [],
  });

  const { result: topicCategories, query: topicCategoriesQuery } = useMany({
    resource: "topic_categories",
    ids: tableProps?.dataSource?.map((tct) => tct.topic_category_id) ?? [],
  });

  const { selectProps: topicsSelectProps } = useSelect({
    resource: "topics",
    pagination: {
      pageSize: 48,
    },
  });

  const { selectProps: topicCategoriesSelectProps } = useSelect({
    resource: "topic_categories",
    pagination: {
      pageSize: 48,
    },
  });

  return (
    <List title="Категории">
      <Table {...tableProps} rowKey="id" sticky={true}>
        <Table.Column
          dataIndex="topic_category_id"
          title="Категория"
          sorter
          defaultSortOrder={getDefaultSortOrder("topic_category", sorters)}
          render={(value) => {
            if (topicCategoriesQuery.isLoading) {
              return "Загрузка...";
            }

            return topicCategories?.data?.find((unit) => unit.id == value)
              ?.title;
          }}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => Number(selectedKey)}
            >
              <Select
                style={{ minWidth: 200 }}
                {...topicCategoriesSelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter("topic_category", filters)}
        />

        <Table.Column
          dataIndex="topic_id"
          title="Топик"
          sorter
          defaultSortOrder={getDefaultSortOrder("topic", sorters)}
          render={(value) => {
            if (topicsQuery.isLoading) {
              return "Загрузка...";
            }

            return topics?.data?.find((unit) => unit.id == value)?.title;
          }}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => {
                return Number(selectedKey);
              }}
            >
              <Select style={{ minWidth: 200 }} {...topicsSelectProps} />
            </FilterDropdown>
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
