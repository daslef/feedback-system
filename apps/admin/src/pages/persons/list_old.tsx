import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useList } from "@refinedev/core";
import { List } from "@refinedev/antd";
import { Table, Input, Select, Button } from "antd";


type SortDirection = "asc" | "desc";

type SortState = {
  field: "last_name" | "person_type";
  order: SortDirection;
};

const PAGE_SIZE = 24;

const ensureContact = (contact?: PersonContact | null): PersonContact => ({
  email: contact?.email ?? "",
  phone: contact?.phone ?? "",
  social: contact?.social ?? "",
});

const getNestedValue = (record: PersonRecord, field: EditableField) => {
  const segments = field.split(".");
  let current: unknown = record;
  for (const segment of segments) {
    if (
      current !== null &&
      typeof current === "object" &&
      segment in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return "";
    }
  }
  return current ?? "";
};

const setNestedValue = (
  record: PersonRecord,
  field: EditableField,
  value: string,
) => {
  const segments = field.split(".");

  if (segments.length === 1) {
    return { ...record, [field]: value } as PersonRecord;
  }

  const [head, ...rest] = segments;
  const nested = record[head as keyof PersonRecord];

  const mergeNested = (
    target: Record<string, unknown>,
    keys: string[],
    nextValue: string,
  ): Record<string, unknown> => {
    const [currentKey, ...remaining] = keys;
    if (!currentKey) {
      return target;
    }

    if (remaining.length === 0) {
      return { ...target, [currentKey]: nextValue };
    }

    const existing = target[currentKey];
    const existingRecord =
      typeof existing === "object" && existing !== null
        ? (existing as Record<string, unknown>)
        : {};

    return {
      ...target,
      [currentKey]: mergeNested(existingRecord, remaining, nextValue),
    };
  };

  const nestedValue =
    typeof nested === "object" && nested !== null
      ? (nested as Record<string, unknown>)
      : {};

  return {
    ...record,
    [head]: mergeNested(nestedValue, rest, value),
  } as PersonRecord;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ru-RU");
};

const normalizeRecords = (records: PersonRecord[]) =>
  records.map((record) => ({
    ...record,
    contact: ensureContact(record.contact),
  }));

const compareValues = (aValue: string, bValue: string) =>
  aValue.localeCompare(bValue, "ru", { sensitivity: "base" });

const sortRecords = (records: PersonRecord[], sorter: SortState | null) => {
  if (!sorter) return records;

  const { field, order } = sorter;

  return [...records].sort((a, b) => {
    const aValue = String(a[field] ?? "");
    const bValue = String(b[field] ?? "");
    const comparison = compareValues(aValue, bValue);
    return order === "asc" ? comparison : -comparison;
  });
};

const filterByType = (records: PersonRecord[], type?: string) => {
  if (!type || type === "all") return records;
  return records.filter((record) => record.person_type === type);
};

export const ListPersons = () => {

    {
      title: (
        <Button
          type="text"
          onClick={() => toggleSort("person_type")}
          style={{ padding: 0, height: "auto", fontWeight: "bold" }}
        >
          Тип {renderSortIndicator(sorter, "person_type")}
        </Button>
      ),
      dataIndex: "person_type",
      key: "person_type",
      render: (value: string, record: PersonRecord) => {
        const isEditing =
          editingCell?.id === record.id && editingCell.field === "person_type";
        return isEditing ? (
          <Select
            autoFocus
            value={editingValue}
            onChange={setEditingValue}
            onBlur={commitEditing}
            onKeyDown={(e) => handleInputKeyDown(e as any)}
            size="small"
            style={{ width: "100%" }}
          >
            {!personTypeTitles.includes(editingValue) &&
              editingValue !== "" && (
                <Select.Option
                  key={`custom-${editingValue}`}
                  value={editingValue}
                >
                  {editingValue}
                </Select.Option>
              )}
            {personTypeOptions.map((type) => (
              <Select.Option key={`type-${type.id}`} value={type.title}>
                {type.title}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <span
            onClick={() => startEditing(record, "person_type")}
            style={{ cursor: "pointer" }}
          >
            {value || "—"}
          </span>
        );
      },
    },
    {
      title: "Почта",
      dataIndex: ["contact", "email"],
      key: "email",
      render: (value: string, record: PersonRecord) => {
        const isEditing =
          editingCell?.id === record.id &&
          editingCell.field === "contact.email";
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
            onClick={() => startEditing(record, "contact.email")}
            style={{ cursor: "pointer" }}
          >
            {value || "—"}
          </span>
        );
      },
    },
    {
      title: "Телефон",
      dataIndex: ["contact", "phone"],
      key: "phone",
      render: (value: string, record: PersonRecord) => {
        const isEditing =
          editingCell?.id === record.id &&
          editingCell.field === "contact.phone";
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
            onClick={() => startEditing(record, "contact.phone")}
            style={{ cursor: "pointer" }}
          >
            {value || "—"}
          </span>
        );
      },
    },
    {
      title: "Соцсеть",
      dataIndex: ["contact", "social"],
      key: "social",
      render: (value: string, record: PersonRecord) => {
        const isEditing =
          editingCell?.id === record.id &&
          editingCell.field === "contact.social";
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
            onClick={() => startEditing(record, "contact.social")}
            style={{ cursor: "pointer" }}
          >
            {value || "—"}
          </span>
        );
      },
    },
    {
      title: "Дата создания",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, _record: PersonRecord) => (
        <Button disabled type="link">
          Просмотреть обращения
        </Button>
      ),
    },
  ];

  return (
    <List title="">
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Пользователи</h2>
        <Select
          value={filterType ?? "all"}
          onChange={(value) => {
            setFilterType(value);
            setCurrentPage(1);
          }}
          style={{ width: 200 }}
        >
          <Select.Option value="all">Все типы</Select.Option>
          {personTypeOptions.map((type) => (
            <Select.Option key={type.id} value={type.title}>
              {type.title}
            </Select.Option>
          ))}
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={paginatedRows}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: currentPage,
          total: processedRows.length,
          pageSize: PAGE_SIZE,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (_total, _range) =>
            `Страница ${currentPage} из ${totalPages}`,
          onChange: (page) => setCurrentPage(page),
        }}
        size="small"
        scroll={{ x: 1200 }}
      />
    </List>
  );
};
