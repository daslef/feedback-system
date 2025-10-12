import { useState } from "react";
import { useList, useMany, useCreate } from "@refinedev/core";

import {
  getDefaultSortOrder,
  List,
  useEditableTable,
  TextField,
  EditButton,
  DeleteButton,
  SaveButton,
  useSelect,
  useModalForm,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Space from "antd/es/space";
import Select from "antd/es/select";
import Form from "antd/es/form";
import Modal from "antd/es/modal";
import Button from "antd/es/button";
import Input from "antd/es/input";
import Flex from "antd/es/flex";

type PersonRecord = {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  person_type: string;
};

type IResponsibility = {
  administrative_unit_id: number;
  official_id: number;
  official_first_name: string | undefined;
  official_last_name: string | undefined;
  official_middle_name: string | undefined;
};

type AdministrativeUnitRecord = {
  id: number;
  title: string;
  unit_type: string;
  unit_type_id: number;
};

const translateUnitType = (value: string) => {
  return {
    settlement: "Поселение",
    town: "Город",
  }[value];
};

const ListAdministrativeUnits = () => {
  const {
    tableProps,
    formProps,
    isEditing,
    sorters,
    id: editId,
    setId: setEditId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
  } = useEditableTable({
    resource: "administrative_units",
    pagination: { currentPage: 1, pageSize: 24 },
    sorters: {
      initial: [
        {
          field: "title",
          order: "asc",
        },
      ],
    },
  });

  const { mutate: attachOfficial, mutation: attachOfficialMutation } =
    useCreate<IResponsibility>({
      resource: "official_responsibilities",
    });

  const [isAttaching, setIsAttaching] = useState(false);
  const [attachingUnitId, setAttachingUnitId] = useState<number | null>(null);
  const [attachingOfficialId, setAttachingOfficialId] = useState<number | null>(
    null,
  );

  const {
    modalProps: createResponsibilityModalProps,
    formProps: createResponsibilityFormProps,
    show: createResponsibilityModalShow,
  } = useModalForm<IResponsibility>({
    resource: "official_responsibilities",
    action: "create",
    redirect: false,
  });

  const { result: responsibilities, query: responsibilitiesQuery } =
    useList<IResponsibility>({
      resource: "official_responsibilities",
      pagination: {
        pageSize: 48,
      },
      filters: [
        {
          field: "administrative_unit.id",
          operator: "in",
          value:
            tableProps?.dataSource?.map(
              (administrative_unit) => administrative_unit.id,
            ) ?? [],
        },
      ],
    });

  const { result: unitTypes, query: unitTypesQuery } = useMany({
    resource: "administrative_unit_types",
    ids: tableProps?.dataSource?.map((unit) => unit.unit_type_id) ?? [],
  });

  const { selectProps: personsSelectProps } = useSelect<PersonRecord>({
    optionLabel: (item) =>
      `${item.last_name} ${item.first_name} ${item?.middle_name ?? ""}`,
    optionValue: (item) => String(item.id),
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

  const { selectProps: administrativeUnitsSelectProps } = useSelect({
    resource: "administrative_units",
    pagination: {
      pageSize: 48,
    },
  });

  return (
    <>
      <List
        title="Поселения"
        breadcrumb={null}
        headerButtons={({ defaultButtons }) => (
          <Space>
            {defaultButtons}
            <Button
              onClick={() => {
                createResponsibilityModalShow();
              }}
              color="geekblue"
            >
              Назначить ответственного
            </Button>
          </Space>
        )}
      >
        <Form {...formProps}>
          <Table
            {...tableProps}
            rowKey="id"
            sticky={true}
            pagination={{
              ...tableProps.pagination,
              hideOnSinglePage: true,
              pageSizeOptions: [12, 24, 48],
            }}
          >
            <Table.Column
              dataIndex="title"
              title="Название"
              sorter
              defaultSortOrder={getDefaultSortOrder("title", sorters)}
              render={(value: string, record: AdministrativeUnitRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="title" style={{ margin: 0 }}>
                    <Input size="small" />
                  </Form.Item>
                ) : (
                  <TextField
                    value={value || "—"}
                    style={{ cursor: "pointer" }}
                  />
                );
              }}
            />

            <Table.Column
              dataIndex="unit_type_id"
              title="Тип"
              width={160}
              sorter
              defaultSortOrder={getDefaultSortOrder("unit_type", sorters)}
              render={(value: string, record: AdministrativeUnitRecord) => {
                if (isEditing(record.id)) {
                  return (
                    <Form.Item name="unit_type_id" style={{ margin: 0 }}>
                      <Select
                        options={unitTypes?.data.map((unitType) => ({
                          label: translateUnitType(unitType.title),
                          value: unitType.id,
                        }))}
                      />
                    </Form.Item>
                  );
                }

                if (unitTypesQuery.isLoading) {
                  return "Загрузка...";
                }

                const unitType = unitTypes?.data?.find(
                  (unitType) => unitType.id == value,
                )?.title;

                return (
                  <TextField
                    value={translateUnitType(unitType)}
                    style={{ cursor: "pointer" }}
                  />
                );
              }}
            />
            <Table.Column
              title="Ответственный"
              width={340}
              sorter
              render={(_, record: PersonRecord) => {
                if (responsibilitiesQuery.isLoading) {
                  return "Загрузка...";
                }

                if (isAttaching && attachingUnitId === record.id) {
                  return (
                    <Select
                      {...personsSelectProps}
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setAttachingOfficialId(Number(value));
                      }}
                    >
                      {personsSelectProps?.options?.map((option) => (
                        <Select.Option key={option.id} value={option.id}>
                          {option.label}
                        </Select.Option>
                      ))}
                    </Select>
                  );
                }

                const responsibilityRecord = responsibilities?.data?.find(
                  (responsibility) =>
                    responsibility.administrative_unit_id == record.id,
                );

                if (!responsibilityRecord) {
                  return (
                    <Button
                      onClick={() => {
                        setIsAttaching(true);
                        setAttachingUnitId(record.id);
                      }}
                      size="small"
                      type="default"
                      color="geekblue"
                    >
                      Назначить
                    </Button>
                  );
                }

                const {
                  official_first_name,
                  official_last_name,
                  official_middle_name,
                } = responsibilityRecord;

                return `${official_last_name} ${official_first_name} ${official_middle_name}`;
              }}
            />
            <Table.Column
              title="Действия"
              width={120}
              render={(_, record) => {
                if (isAttaching && attachingUnitId === record.id) {
                  return (
                    <Space>
                      <SaveButton
                        {...saveButtonProps}
                        hideText
                        disabled={!attachingOfficialId}
                        size="small"
                        onClick={() => {
                          attachOfficial({
                            values: {
                              official_id: attachingOfficialId,
                              administrative_unit_id: record.id,
                            },
                          });
                          setAttachingOfficialId(null);
                          setIsAttaching(false);
                          setEditId(undefined);
                        }}
                      />
                      <Button
                        {...cancelButtonProps}
                        size="small"
                        onClick={() => {
                          if (isAttaching) {
                            setAttachingOfficialId(null);
                            setIsAttaching(false);
                            cancelButtonProps.onClick();
                          }
                        }}
                      >
                        ↩
                      </Button>
                    </Space>
                  );
                } else if (isEditing(record.id)) {
                  return (
                    <Space>
                      <SaveButton {...saveButtonProps} hideText size="small" />
                      <Button {...cancelButtonProps} size="small">
                        ↩
                      </Button>
                    </Space>
                  );
                }

                return (
                  <Space>
                    <EditButton
                      {...editButtonProps(record.id)}
                      onClick={() => {
                        setEditId(record.id);
                        editButtonProps(record.id).onClick();
                      }}
                      hideText
                      size="small"
                    />
                    <DeleteButton
                      hideText
                      size="small"
                      recordItemId={record.id}
                      resource="administrative_units"
                    />
                  </Space>
                );
              }}
            />
          </Table>
        </Form>
      </List>

      <Modal
        {...createResponsibilityModalProps}
        title="Назначение ответственного"
        width={720}
      >
        <Form
          {...createResponsibilityFormProps}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Flex gap={24}>
            <Form.Item
              label="Ответственный"
              name="official_id"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ flex: 5 }}
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
              style={{ flex: 4 }}
            >
              <Select {...administrativeUnitsSelectProps}>
                {administrativeUnitsSelectProps?.options?.map((option) => (
                  <Select.Option key={option.id} value={option.id}>
                    {option.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export default ListAdministrativeUnits;
