import React from "react";

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

import { Table, Space, Input, Select, Form, Modal, Row, Button } from "antd";

type IOfficial = {
  first_name: string;
  last_name: string;
  middle_name: string;
  person_type_id: number;
  email: string;
  phone: string | undefined;
  social: string | undefined;
};

type IResponsibility = {
  administrative_unit_id: number;
  official_id: number;
};

export const ListResponsibilities = () => {
  const { tableProps, sorters, filters } = useTable({
    resource: "official_responsibilities",
    pagination: { currentPage: 1, pageSize: 24 },
    sorters: {
      initial: [{ field: "official_id", order: "asc" }],
    },
  });

  const {
    modalProps: createOfficialModalProps,
    formProps: createOfficialFormProps,
    show: createOfficialModalShow,
  } = useModalForm<IOfficial>({
    action: "create",
    resource: "persons",
    redirect: false,
  });

  const {
    modalProps: createResponsibilityModalProps,
    formProps: createResponsibilityFormProps,
    show: createResponsibilityModalShow,
  } = useModalForm<IResponsibility>({
    action: "create",
    redirect: false,
  });

  const { result: administrativeUnits, query: administrativeUnitsQuery } =
    useMany({
      resource: "administrative_units",
      ids:
        tableProps?.dataSource?.map(
          (responsibility) => responsibility.administrative_unit_id,
        ) ?? [],
    });

  const { result: officials, query: personsQuery } = useMany({
    resource: "persons",
    ids:
      tableProps?.dataSource?.map(
        (responsibility) => responsibility.official_id,
      ) ?? [],
  });

  const { selectProps: personTypesSelectProps } = useSelect({
    resource: "person_types",
    pagination: {
      pageSize: 12,
    },
  });

  const { selectProps: administrativeUnitsSelectProps } = useSelect({
    resource: "administrative_units",
    pagination: {
      pageSize: 48,
    },
  });

  const { selectProps: personsSelectProps } = useSelect({
    optionLabel: (item) =>
      `${item.last_name} ${item.first_name} ${item?.middle_name ?? ""}`,
    resource: "persons",
    pagination: {
      pageSize: 48,
    },
    filters: [
      {
        field: "person_type.title",
        operator: "eq",
        value: "official",
      },
    ],
  });

  console.log(personsSelectProps);

  return (
    <>
      <List
        title="Ответственные"
        createButtonProps={{
          hidden: true,
        }}
      >
        <Row gutter={8} justify={"end"} style={{ marginBottom: 24 }}>
          <Space>
            <Button
              onClick={() => {
                createOfficialModalShow();
              }}
              type="default"
            >
              Создать ответственного
            </Button>

            <Button
              onClick={() => {
                createResponsibilityModalShow();
              }}
              type="default"
            >
              Назначить ответственного
            </Button>
          </Space>
        </Row>

        <Table {...tableProps} rowKey="id" sticky={true}>
          <Table.Column
            dataIndex="official_id"
            title="Ответственный"
            sorter
            defaultSortOrder={getDefaultSortOrder("official_id", sorters)}
            render={(value) => {
              if (personsQuery.isLoading) {
                return "Загрузка...";
              }

              const officialData = officials?.data?.find(
                (official) => official.id == value,
              );
              return `${officialData?.last_name} ${officialData?.first_name} ${officialData?.middle_name}`;
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
                <Select style={{ minWidth: 200 }} {...personsSelectProps} />
              </FilterDropdown>
            )}
          />

          <Table.Column
            dataIndex="administrative_unit_id"
            title="Поселение"
            sorter
            defaultSortOrder={getDefaultSortOrder(
              "administrative_unit_id",
              sorters,
            )}
            render={(value) => {
              if (administrativeUnitsQuery.isLoading) {
                return "Загрузка...";
              }

              return administrativeUnits?.data?.find((unit) => unit.id == value)
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
                  {...administrativeUnitsSelectProps}
                />
              </FilterDropdown>
            )}
            defaultFilteredValue={getDefaultFilter(
              "administrative_unit_id",
              filters,
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

      <Modal
        {...createResponsibilityModalProps}
        title="Назначение ответственного"
      >
        <Form {...createResponsibilityFormProps} layout="vertical">
          <Form.Item
            label="Ответственный"
            name="official_id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...personsSelectProps}>
              {personsSelectProps?.options?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Поселение"
            name="administrative_unit_id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...administrativeUnitsSelectProps}>
              {administrativeUnitsSelectProps?.options?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal {...createOfficialModalProps} title="Новое ответственное лицо">
        <Form {...createOfficialFormProps} layout="vertical">
          <Form.Item
            label="Фамилия"
            name="last_name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Имя"
            name="first_name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name="middle_name"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Почта"
            name="email"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Соцсеть"
            name="social"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Тип"
            name="person_type_id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select {...personTypesSelectProps}>
              {personTypesSelectProps?.options?.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
