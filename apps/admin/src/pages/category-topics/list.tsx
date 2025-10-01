import { useMany } from "@refinedev/core";

import {
  useTable,
  EditButton,
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
  useSelect,
  List,
  useModalForm,
} from "@refinedev/antd";

import { Table, Select, Modal, Form, Button, Row, Space } from "antd";

type ITopicCategoryTopic = {
  topic_category_id: number;
  topic_id: number;
};

export const ListTopicCategoryTopics = () => {
  const { tableProps, sorters, filters } = useTable({
    pagination: { currentPage: 1, pageSize: 12 },
    sorters: {
      initial: [{ field: "topic_category_id", order: "asc" }],
    },
    filters: {
      initial: [],
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

  const {
    modalProps: createTopicCategoryTopicModalProps,
    formProps: createTopicCategoryTopicFormProps,
    show: createTopicCategoryTopicModalShow,
  } = useModalForm<ITopicCategoryTopic>({
    action: "create",
    resource: "topic_category_topics",
    redirect: false,
  });

  return (
    <>
      <List
        title="Категории"
        createButtonProps={{
          hidden: true,
        }}
      >
        <Row gutter={8} justify={"end"} style={{ marginBottom: 24 }}>
          <Space>
            <Button
              onClick={() => {
                createTopicCategoryTopicModalShow();
              }}
              type="default"
            >
              Создать связь категории и топика
            </Button>
          </Space>
        </Row>

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
                mapValue={(selectedKey) => {
                  if (Array.isArray(selectedKey)) return undefined;
                  return selectedKey && selectedKey !== ""
                    ? Number(selectedKey)
                    : undefined;
                }}
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
                  if (Array.isArray(selectedKey)) return undefined;
                  return selectedKey && selectedKey !== ""
                    ? Number(selectedKey)
                    : undefined;
                }}
              >
                <Select style={{ minWidth: 200 }} {...topicsSelectProps} />
              </FilterDropdown>
            )}
          />

          <Table.Column
            title="Действия"
            minWidth={120}
            render={(_, record) => (
              <EditButton hideText size="small" recordItemId={record.id} />
            )}
          />
        </Table>
      </List>

      <Modal
        {...createTopicCategoryTopicModalProps}
        title="Создание связи категории и топика"
      >
        <Form {...createTopicCategoryTopicFormProps} layout="vertical">
          <Form.Item
            label="Категория"
            name="topic_category_id"
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите категорию",
              },
            ]}
          >
            <Select {...topicCategoriesSelectProps}>
              {topicCategoriesSelectProps?.options?.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Топик"
            name="topic_id"
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите топик",
              },
            ]}
          >
            <Select {...topicsSelectProps}>
              {topicsSelectProps?.options?.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
