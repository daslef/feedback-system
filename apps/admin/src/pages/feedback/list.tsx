import { useMany } from "@refinedev/core";
import {
  useTable,
  ShowButton,
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
  useSelect,
  List,
} from "@refinedev/antd";

import { Table, Space, Select, Tag } from "antd";

export const ListFeedback = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: "feedback",
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: {
      initial: [{ field: "created_at", order: "asc" }],
    },
  });

  const { result: projects, query: projectsQuery } = useMany({
    resource: "projects",
    ids: tableProps?.dataSource?.map((feedback) => feedback.project_id) ?? [],
  });

  const { selectProps: feedbackTypeSelectProps } = useSelect({
    resource: "feedback_types",
    optionLabel: "title",
    optionValue: "id",
    pagination: {
      pageSize: 48,
    },
    defaultValue: getDefaultFilter("feedback_type_id", filters, "eq"),
  });

  const { selectProps: feedbackStatusSelectProps } = useSelect({
    resource: "feedback_statuses",
    optionLabel: "title",
    optionValue: "id",
    pagination: {
      pageSize: 48,
    },
    defaultValue: getDefaultFilter("feedback_status_id", filters, "eq"),
  });

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "orange",
      approved: "green",
      declined: "red",
    };
    return colorMap[status] || "default";
  };

  const getStatusText = (status: string) => {
    return {
      pending: "В обработке",
      approved: "Утверждено",
      declined: "Отклонено",
    }[status];
  };

  return (
    <List title="Обращения граждан">
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{ hideOnSinglePage: true }}
      >
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
          dataIndex="project_id"
          title="Проект"
          sorter
          render={(value) => {
            if (projectsQuery.isLoading) {
              return "Загрузка...";
            }

            return projects?.data?.find((project) => project.id == value)
              ?.title;
          }}
        />
        <Table.Column
          dataIndex="feedback_type_id"
          title="Тип обращения"
          sorter
          render={(_, record) => record.feedback_type}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => Number(selectedKey)}
            >
              <Select style={{ minWidth: 200 }} {...feedbackTypeSelectProps} />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "feedback_type_id",
            filters,
            "eq",
          )}
        />
        <Table.Column
          dataIndex="topic"
          title="Тема"
          sorter
          render={(value) => value || "—"}
        />
        <Table.Column
          dataIndex="feedback_status_id"
          title="Статус"
          sorter
          render={(_, record) => (
            <Tag color={getStatusColor(record.feedback_status)}>
              {getStatusText(record.feedback_status)}
            </Tag>
          )}
          filterDropdown={(props) => (
            <FilterDropdown
              {...props}
              mapValue={(selectedKey) => Number(selectedKey)}
            >
              <Select
                style={{ minWidth: 200 }}
                {...feedbackStatusSelectProps}
              />
            </FilterDropdown>
          )}
          defaultFilteredValue={getDefaultFilter(
            "feedback_status_id",
            filters,
            "eq",
          )}
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
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
