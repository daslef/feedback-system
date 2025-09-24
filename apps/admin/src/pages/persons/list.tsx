import { useEffect, useState, type KeyboardEvent } from "react";
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
      initial: [],
    },
    syncWithLocation: true,
  });

  const [filterType, setFilterType] = useState<string | null>("all");

  useEffect(() => {
    const personFilterIx = filters.findIndex(
      (filter) => "field" in filter && filter.field === "person_type",
    );

    if (personFilterIx !== -1 && filterType === "all") {
      filters.splice(personFilterIx, 1);
    } else if (personFilterIx !== -1) {
      filters[personFilterIx].value = filterType;
    } else if (personFilterIx === -1 && filterType !== "all") {
      filters.push({
        field: "person_type",
        operator: "eq",
        value: filterType,
      });
    }
  }, [filterType]);

  const { result: personTypes, query } = useMany({
    resource: "person_types",
    ids: tableProps?.dataSource?.map((project) => project.person_type_id) ?? [],
  });

  const { selectProps: personTypeSelectProps } = useSelect({
    resource: "person_types",
    // defaultValue: getDefaultFilter("person_type_id", filters, "eq"),
  });

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // commitEditing();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      // stopEditing();
    }
  };

  return (
    <List title="Пользователи">
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Select
          value={filterType}
          onChange={(value) => {
            setFilterType(value);
          }}
          style={{ width: 200 }}
        >
          <Select.Option value="all">Все типы</Select.Option>
          {personTypes.data.map((type) => (
            <Select.Option key={type.id} value={type.title}>
              {type.title}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Form {...formProps}>
        <Table
          {...tableProps}
          rowKey="id"
          onRow={(record) => ({
            // eslint-disable-next-line
            onClick: (event: any) => {
              if (event.target.nodeName === "TD") {
                setEditId && setEditId(record.id);
              }
            },
          })}
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
                  <Input
                    autoFocus
                    onKeyDown={(e) => handleInputKeyDown(e as any)}
                    size="small"
                  />
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
                  <Input
                    autoFocus
                    onKeyDown={(e) => handleInputKeyDown(e as any)}
                    size="small"
                  />
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
                  <Input
                    autoFocus
                    onKeyDown={(e) => handleInputKeyDown(e as any)}
                    size="small"
                  />
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
                  <Input
                    autoFocus
                    onKeyDown={(e) => handleInputKeyDown(e as any)}
                    size="small"
                  />
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
                  <Input
                    autoFocus
                    onKeyDown={(e) => handleInputKeyDown(e as any)}
                    size="small"
                  />
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
                  <Input
                    autoFocus
                    onKeyDown={(e) => handleInputKeyDown(e as any)}
                    size="small"
                  />
                </Form.Item>
              ) : (
                <TextField value={value || "—"} style={{ cursor: "pointer" }} />
              );
            }}
          />

          <Table.Column
            dataIndex={"person_type_id"}
            title="Тип"
            sorter
            render={(value: string, record: PersonRecord) => {
              if (query.isLoading) {
                return "Загрузка...";
              }

              const text = personTypes?.data?.find(
                (type) => type.id == value,
              )?.title;

              return isEditing(record.id) ? (
                <Form.Item name="person_type_id" style={{ margin: 0 }}>
                  <Select {...personTypeSelectProps} />
                </Form.Item>
              ) : (
                <TextField value={text} style={{ cursor: "pointer" }} />
              );
            }}
            filterDropdown={(props) => (
              <FilterDropdown
                {...props}
                mapValue={(selectedKey) => Number(selectedKey)}
              >
                <Select style={{ minWidth: 200 }} {...personTypeSelectProps} />
              </FilterDropdown>
            )}
            defaultFilteredValue={getDefaultFilter(
              "person_type_id",
              filters,
              "eq",
            )}
          />

          <Table.Column
            title="Действия"
            render={(_, record) => {
              if (isEditing(record.id)) {
                return (
                  <Space>
                    <SaveButton {...saveButtonProps} hideText size="small" />
                    <Button {...cancelButtonProps} size="small">
                      Cancel
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
