import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useList } from "@refinedev/core";
import { Table, Input, Select, Button } from "antd";

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

const paginate = (records: PersonRecord[], page: number) => {
  const start = (page - 1) * PAGE_SIZE;
  return records.slice(start, start + PAGE_SIZE);
};

const renderSortIndicator = (
  sorter: SortState | null,
  field: SortState["field"],
) => {
  if (!sorter || sorter.field !== field) return "";
  return sorter.order === "asc" ? "▲" : "▼";
};

export const PersonList = () => {
  const {
    result: personsResult,
    query: { isLoading: isPersonsLoading },
  } = useList<PersonRecord>({ resource: "persons" });

  const {
    result: typesResult,
    query: { isLoading: isTypesLoading },
  } = useList<PersonType>({ resource: "person_types" });

  const [rows, setRows] = useState<PersonRecord[]>([]);
  const [filterType, setFilterType] = useState<string | undefined>("all");
  const [sorter, setSorter] = useState<SortState | null>({
    field: "last_name",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (!personsResult?.data) return;

    const normalizedData = normalizeRecords(personsResult.data);
    const deduplicated = Array.from(
      new Map(normalizedData.map((record) => [record.id, record])).values(),
    );

    setRows((previous) => {
      if (
        previous.length === deduplicated.length &&
        previous.every((row, index) => {
          const next = deduplicated[index];
          if (!next) return false;
          return (
            row.id === next.id &&
            row.first_name === next.first_name &&
            row.last_name === next.last_name &&
            row.middle_name === next.middle_name &&
            row.person_type === next.person_type &&
            row.contact?.email === next.contact?.email &&
            row.contact?.phone === next.contact?.phone &&
            row.contact?.social === next.contact?.social &&
            row.created_at === next.created_at
          );
        })
      ) {
        return previous;
      }

      return deduplicated;
    });
  }, [personsResult?.data]);

  const processedRows = useMemo(() => {
    const filtered = filterByType(rows, filterType);
    const sorted = sortRecords(filtered, sorter);
    return sorted;
  }, [filterType, rows, sorter]);

  const totalPages = useMemo(() => {
    const count = processedRows.length;
    return count === 0 ? 1 : Math.ceil(count / PAGE_SIZE);
  }, [processedRows.length]);

  useEffect(() => {
    setCurrentPage((prev) => {
      if (prev > totalPages) return totalPages;
      if (prev < 1) return 1;
      return prev;
    });
  }, [totalPages]);

  const paginatedRows = useMemo(
    () => paginate(processedRows, currentPage),
    [processedRows, currentPage],
  );

  const personTypeOptions = typesResult?.data ?? [];
  const personTypeTitles = useMemo(
    () => personTypeOptions.map((type) => type.title),
    [personTypeOptions],
  );

  const startEditing = (record: PersonRecord, field: EditableField) => {
    if (field === "person_type" && personTypeOptions.length === 0) return;
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

  const toggleSort = (field: SortState["field"]) => {
    setSorter((prev) => {
      if (!prev || prev.field !== field) {
        return { field, order: "asc" };
      }
      if (prev.order === "asc") {
        return { field, order: "desc" };
      }
      return null;
    });
  };

  const isLoading = isPersonsLoading || isTypesLoading;

  // Ant Design Table columns
  const columns = [
    {
      title: (
        <Button
          type="text"
          onClick={() => toggleSort("last_name")}
          style={{ padding: 0, height: "auto", fontWeight: "bold" }}
        >
          Фамилия {renderSortIndicator(sorter, "last_name")}
        </Button>
      ),
      dataIndex: "last_name",
      key: "last_name",
      render: (value: string, record: PersonRecord) => {
        const isEditing =
          editingCell?.id === record.id && editingCell.field === "last_name";
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
      },
    },
    {
      title: "Имя",
      dataIndex: "first_name",
      key: "first_name",
      render: (value: string, record: PersonRecord) => {
        const isEditing =
          editingCell?.id === record.id && editingCell.field === "first_name";
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
      },
    },
    {
      title: "Отчество",
      dataIndex: "middle_name",
      key: "middle_name",
      render: (value: string, record: PersonRecord) => {
        const isEditing =
          editingCell?.id === record.id && editingCell.field === "middle_name";
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
      },
    },
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
    <div>
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
    </div>
  );
};
