import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useList } from "@refinedev/core";

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

  return (
    <div className="page-card">
      <div className="page-header">
        <h1>Пользователи</h1>
      </div>

      <div className="table-controls">
        <label className="control">
          <span className="control-label">Тип</span>
          <select
            className="control-input"
            value={filterType ?? "all"}
            onChange={(event) => {
              setFilterType(event.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">Все типы</option>
            {personTypeOptions.map((type) => (
              <option key={`filter-type-${type.id}`} value={type.title}>
                {type.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="table-wrapper">
        <table className="person-table">
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  className="table-sorter"
                  onClick={() => toggleSort("last_name")}
                >
                  Фамилия{" "}
                  <span>{renderSortIndicator(sorter, "last_name")}</span>
                </button>
              </th>
              <th>Имя</th>
              <th>Отчество</th>
              <th>
                <button
                  type="button"
                  className="table-sorter"
                  onClick={() => toggleSort("person_type")}
                >
                  Тип <span>{renderSortIndicator(sorter, "person_type")}</span>
                </button>
              </th>
              <th>Почта</th>
              <th>Телефон</th>
              <th>Соцсеть</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="empty-cell" colSpan={9}>
                  Загрузка данных...
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td className="empty-cell" colSpan={9}>
                  Пока нет ни одной записи
                </td>
              </tr>
            ) : (
              paginatedRows.map((record) => (
                <tr key={record.id}>
                  {(
                    [
                      "last_name",
                      "first_name",
                      "middle_name",
                      "person_type",
                      "contact.email",
                      "contact.phone",
                      "contact.social",
                    ] as EditableField[]
                  ).map((field) => {
                    const isEditing =
                      editingCell?.id === record.id &&
                      editingCell.field === field;
                    const cellValue = String(
                      getNestedValue(record, field) ?? "",
                    );

                    return (
                      <td
                        key={field}
                        className="editable-cell"
                        onClick={() =>
                          !isEditing && startEditing(record, field)
                        }
                      >
                        {isEditing ? (
                          field === "person_type" ? (
                            <select
                              autoFocus
                              className="cell-input"
                              value={editingValue}
                              onChange={(event) =>
                                setEditingValue(event.target.value)
                              }
                              onBlur={commitEditing}
                              onKeyDown={handleInputKeyDown}
                            >
                              {!personTypeTitles.includes(editingValue) &&
                                editingValue !== "" && (
                                  <option
                                    key={`custom-${editingValue}`}
                                    value={editingValue}
                                  >
                                    {editingValue}
                                  </option>
                                )}
                              {personTypeOptions.map((type) => (
                                <option
                                  key={`type-${type.id}`}
                                  value={type.title}
                                >
                                  {type.title}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              autoFocus
                              className="cell-input"
                              value={editingValue}
                              onChange={(event) =>
                                setEditingValue(event.target.value)
                              }
                              onBlur={commitEditing}
                              onKeyDown={handleInputKeyDown}
                            />
                          )
                        ) : (
                          <span className="cell-value">{cellValue || "—"}</span>
                        )}
                      </td>
                    );
                  })}
                  <td>{formatDate(record.created_at)}</td>
                  <td>
                    <button className="action-button" disabled type="button">
                      Просмотреть обращения
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-button"
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span className="pagination-info">
          Страница {Math.min(currentPage, totalPages)} из {totalPages}
        </span>
        <button
          className="pagination-button"
          type="button"
          onClick={() =>
            setCurrentPage((page) => Math.min(page + 1, totalPages))
          }
          disabled={currentPage >= totalPages}
        >
          Вперёд
        </button>
      </div>
    </div>
  );
};
