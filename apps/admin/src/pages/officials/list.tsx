import { useList } from "@refinedev/core";

import {
  EditButton,
  getDefaultSortOrder,
  List,
  useSelect,
  useEditableTable,
  TextField,
  SaveButton,
  DeleteButton,
  useModalForm,
} from "@refinedev/antd";

import Table from "antd/es/table";
import Form from "antd/es/form";
import Space from "antd/es/space";
import Input from "antd/es/input";
import Select from "antd/es/select";
import Modal from "antd/es/modal";
import Button from "antd/es/button";
import Flex from "antd/es/flex";

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

type IOfficial = {
  first_name: string;
  last_name: string;
  middle_name: string;
  person_type_id: number;
  email: string;
  phone: string | undefined;
  social: string | undefined;
};

const ListPersons = () => {
  const {
    tableProps,
    formProps,
    isEditing,
    setId: setEditId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
    sorters,
  } = useEditableTable({
    resource: "persons",
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
          value: "official",
        },
      ],
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
    defaultFormValues: {
      person_type_id: 2,
    },
  });

  const { result: administrativeUnits, query: administrativeUnitsQuery } =
    useList({
      resource: "official_responsibilities",
      pagination: {
        pageSize: 48,
      },
      filters: [
        {
          field: "official_id",
          operator: "in",
          value: tableProps?.dataSource?.map((official) => official.id) ?? [],
        },
      ],
    });

  const { selectProps: personTypesSelectProps } = useSelect({
    resource: "person_types",
    pagination: {
      pageSize: 12,
    },
  });

  return (
    <>
      <List
        title="Администрация"
        breadcrumb={null}
        createButtonProps={{
          hidden: true,
        }}
        headerButtons={() => (
          <Space>
            <Button
              onClick={() => {
                createOfficialModalShow();
              }}
              type="default"
            >
              Создать
            </Button>
          </Space>
        )}
      >
        <Form {...formProps}>
          <Table
            {...tableProps}
            rowKey="id"
            pagination={{
              ...tableProps.pagination,
              hideOnSinglePage: true,
              pageSizeOptions: [12, 24, 48],
            }}
          >
            <Table.Column
              dataIndex="last_name"
              title="Фамилия"
              sorter
              defaultSortOrder={getDefaultSortOrder("last_name", sorters)}
              render={(value: string, record: PersonRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="last_name" style={{ margin: 0 }}>
                    <Input autoFocus size="small" />
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
              dataIndex="first_name"
              title="Имя"
              sorter
              defaultSortOrder={getDefaultSortOrder("first_name", sorters)}
              render={(value: string, record: PersonRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="first_name" style={{ margin: 0 }}>
                    <Input autoFocus size="small" />
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
              dataIndex="middle_name"
              title="Отчество"
              sorter
              defaultSortOrder={getDefaultSortOrder("middle_name", sorters)}
              render={(value: string, record: PersonRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="middle_name" style={{ margin: 0 }}>
                    <Input autoFocus size="small" />
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
              dataIndex="phone"
              title="Телефон"
              sorter
              defaultSortOrder={getDefaultSortOrder("phone", sorters)}
              render={(value: string, record: PersonRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="phone" style={{ margin: 0 }}>
                    <Input autoFocus size="small" />
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
              dataIndex="email"
              title="Почта"
              sorter
              defaultSortOrder={getDefaultSortOrder("email", sorters)}
              render={(value: string, record: PersonRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="email" style={{ margin: 0 }}>
                    <Input autoFocus size="small" />
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
              dataIndex="social"
              title="Соцсеть"
              render={(value: string, record: PersonRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="social" style={{ margin: 0 }}>
                    <Input autoFocus size="small" />
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
              title="Поселение"
              sorter
              defaultSortOrder={getDefaultSortOrder(
                "administrative_unit_id",
                sorters,
              )}
              render={(_, record) => {
                if (administrativeUnitsQuery.isLoading) {
                  return "Загрузка...";
                }

                return (
                  administrativeUnits?.data?.find(
                    (unit) => unit.official_id == record.id,
                  )?.administrative_unit ?? "—"
                );
              }}
            />

            <Table.Column
              title="Действия"
              minWidth={120}
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
                      resource="persons"
                    />
                  </Space>
                );
              }}
            />
          </Table>
        </Form>
      </List>

      <Modal {...createOfficialModalProps} title="Новое ответственное лицо">
        <Form
          {...createOfficialFormProps}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Flex gap={16}>
            <Form.Item
              label="Фамилия"
              name="last_name"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </Flex>

          <Flex gap={16}>
            <Form.Item
              label="Почта"
              name="email"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
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
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </Flex>

          <Form.Item
            label="Тип"
            name="person_type_id"
            rules={[
              {
                required: true,
              },
            ]}
            hidden={true}
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

export default ListPersons;
