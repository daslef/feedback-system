import { useMany } from "@refinedev/core";
import {
  EditButton,
  getDefaultSortOrder,
  getDefaultFilter,
  FilterDropdown,
  useSelect,
  List,
  useEditableTable,
  TextField,
  SaveButton,
} from "@refinedev/antd";

import { Table, Form, Space, Input, Select, Button } from "antd";

type PersonContact = {
  email: string | null;
  phone: string | null;
  social: string | null;
};

type PersonRecord = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  person_type: string;
  created_at?: string | null;
  contact?: PersonContact | null;
};

type PersonType = {
  id: number;
  title: string;
};

export const ListPersons = () => {
  const {
    tableProps,
    formProps,
    isEditing,
    setId: setEditId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
    sorters,
    filters,
  } = useEditableTable({
    pagination: { currentPage: 1, pageSize: 24 },
    sorters: {
      initial: [
        {
          field: "last_name",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "person_type.title",
          operator: "eq",
          value: "citizen",
        },
      ],
    },
  });

  return (
    <List title="Пользователи">
      <Form {...formProps}>
        <Table
          {...tableProps}
          rowKey="id"
          pagination={{ hideOnSinglePage: true }}
        >
          <Table.Column
            dataIndex="last_name"
            title="Фамилия"
            sorter
            defaultSortOrder={getDefaultSortOrder("last_name", sorters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input />
              </FilterDropdown>
            )}
            render={(value: string, record: PersonRecord) => {
              return isEditing(record.id) ? (
                <Form.Item name="last_name" style={{ margin: 0 }}>
                  <Input autoFocus size="small" />
                </Form.Item>
              ) : (
                <TextField value={value || "—"} style={{ cursor: "pointer" }} />
              );
            }}
          />

          <Table.Column
            dataIndex="first_name"
            title="Имя"
            sorter
            defaultSortOrder={getDefaultSortOrder("first_name", sorters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input />
              </FilterDropdown>
            )}
            render={(value: string, record: PersonRecord) => {
              return isEditing(record.id) ? (
                <Form.Item name="first_name" style={{ margin: 0 }}>
                  <Input autoFocus size="small" />
                </Form.Item>
              ) : (
                <TextField value={value || "—"} style={{ cursor: "pointer" }} />
              );
            }}
          />

          <Table.Column
            dataIndex="middle_name"
            title="Отчество"
            sorter
            defaultSortOrder={getDefaultSortOrder("middle_name", sorters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input />
              </FilterDropdown>
            )}
            render={(value: string, record: PersonRecord) => {
              return isEditing(record.id) ? (
                <Form.Item name="middle_name" style={{ margin: 0 }}>
                  <Input autoFocus size="small" />
                </Form.Item>
              ) : (
                <TextField value={value || "—"} style={{ cursor: "pointer" }} />
              );
            }}
          />

          <Table.Column
            dataIndex="phone"
            title="Телефон"
            sorter
            defaultSortOrder={getDefaultSortOrder("phone", sorters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input />
              </FilterDropdown>
            )}
            render={(value: string, record: PersonRecord) => {
              return isEditing(record.id) ? (
                <Form.Item name="phone" style={{ margin: 0 }}>
                  <Input autoFocus size="small" />
                </Form.Item>
              ) : (
                <TextField value={value || "—"} style={{ cursor: "pointer" }} />
              );
            }}
          />

          <Table.Column
            dataIndex="email"
            title="Почта"
            sorter
            defaultSortOrder={getDefaultSortOrder("email", sorters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input />
              </FilterDropdown>
            )}
            render={(value: string, record: PersonRecord) => {
              return isEditing(record.id) ? (
                <Form.Item name="email" style={{ margin: 0 }}>
                  <Input autoFocus size="small" />
                </Form.Item>
              ) : (
                <TextField value={value || "—"} style={{ cursor: "pointer" }} />
              );
            }}
          />

          <Table.Column
            dataIndex="social"
            title="Соцсети"
            sorter
            defaultSortOrder={getDefaultSortOrder("social", sorters)}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input />
              </FilterDropdown>
            )}
            render={(value: string, record: PersonRecord) => {
              return isEditing(record.id) ? (
                <Form.Item name="social" style={{ margin: 0 }}>
                  <Input autoFocus size="small" />
                </Form.Item>
              ) : (
                <TextField value={value || "—"} style={{ cursor: "pointer" }} />
              );
            }}
          />

          <Table.Column
            title="Действия"
            render={(_, record) => {
              if (isEditing(record.id)) {
                return (
                  <Space>
                    <SaveButton {...saveButtonProps} hideText size="small" />
                    <Button {...cancelButtonProps} size="small">
                      Отменить
                    </Button>
                  </Space>
                );
              }
              return (
                <EditButton
                  {...editButtonProps(record.id)}
                  hideText
                  size="small"
                />
              );
            }}
          />
        </Table>
      </Form>
    </List>
  );
};
