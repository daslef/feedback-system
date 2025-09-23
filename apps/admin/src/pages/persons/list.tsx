import { useState, type KeyboardEvent } from "react";
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

import { Table, Space, Input, Select, Button } from "antd";

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

type EditableField =
  | "last_name"
  | "first_name"
  | "middle_name"
  | "person_type"
  | "contact.email"
  | "contact.phone"
  | "contact.social";

type EditingCell = {
  id: number;
  field: EditableField;
};

export const ListPersons = () => {
  const [filterType, setFilterType] = useState<string | undefined>("all");
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("ru-RU");
  };

  const startEditing = (record: PersonRecord, field: EditableField) => {
    if (field === "person_type" && personTypes.length === 0) return;
    const currentValue = String(getNestedValue(record, field) ?? "");
    setEditingCell({ id: record.id, field });
    setEditingValue(currentValue);
  };

  const stopEditing = () => {
    setEditingCell(null);
    setEditingValue("");
  };

  const commitEditing = () => {
    if (!editingCell) return;
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === editingCell.id
          ? setNestedValue(row, editingCell.field, editingValue)
          : row,
      ),
    );
    stopEditing();
  };

  const { tableProps, sorters, filters } = useTable({
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

  const { result: personTypes, query } = useMany({
    resource: "person_types",
    ids: tableProps?.dataSource?.map((project) => project.person_type_id) ?? [],
  });

  const { selectProps: personTypeSelectProps } = useSelect({
    resource: "person_types",
    defaultValue: getDefaultFilter("person_type_id", filters, "eq"),
  });

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEditing();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      stopEditing();
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
          value={filterType ?? "all"}
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
      <Table {...tableProps} rowKey="id">
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
            const isEditing =
              editingCell?.id === record.id &&
              editingCell.field === "last_name";
            return isEditing ? (
              <Input
                autoFocus
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={commitEditing}
                onKeyDown={(e) => handleInputKeyDown(e as any)}
                size="small"
              />
            ) : (
              <span
                onClick={() => startEditing(record, "last_name")}
                style={{ cursor: "pointer" }}
              >
                {value || "—"}
              </span>
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
            const isEditing =
              editingCell?.id === record.id &&
              editingCell.field === "first_name";
            return isEditing ? (
              <Input
                autoFocus
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={commitEditing}
                onKeyDown={(e) => handleInputKeyDown(e as any)}
                size="small"
              />
            ) : (
              <span
                onClick={() => startEditing(record, "first_name")}
                style={{ cursor: "pointer" }}
              >
                {value || "—"}
              </span>
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
            const isEditing =
              editingCell?.id === record.id &&
              editingCell.field === "middle_name";
            return isEditing ? (
              <Input
                autoFocus
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={commitEditing}
                onKeyDown={(e) => handleInputKeyDown(e as any)}
                size="small"
              />
            ) : (
              <span
                onClick={() => startEditing(record, "middle_name")}
                style={{ cursor: "pointer" }}
              >
                {value || "—"}
              </span>
            );
          }}
        />

        <Table.Column
          dataIndex={"person_type_id"}
          title="Тип"
          sorter
          render={(value) => {
            if (query.isLoading) {
              return "Загрузка...";
            }

            return personTypes?.data?.find((type) => type.id == value)?.title;
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
