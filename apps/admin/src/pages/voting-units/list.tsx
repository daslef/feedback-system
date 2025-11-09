import { useMany } from "@refinedev/core";

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

type UnitRecord = {
  id: number;
  title: string;
  voting_region_id: number;
  voting_region: string;
};

type RegionRecord = {
  id: number;
  title: string;
}

const ListVotingUnits = () => {
  const {
    tableProps,
    formProps,
    isEditing,
    setId: setEditId,
    saveButtonProps,
    cancelButtonProps,
    editButtonProps,
    sorters,
  } = useEditableTable<UnitRecord>({
    resource: "voting_units",
    pagination: { currentPage: 1, pageSize: 48 },
    sorters: {
      initial: [
        {
          field: "voting_region",
          order: "asc",
        },
        {
          field: "title",
          order: "asc",
        },
      ],
    },
    filters: {
      initial: [],
    },
  });

  const {
    modalProps: createUnitModalProps,
    formProps: createUnitFormProps,
    show: createUnitModalShow,
  } = useModalForm<Pick<UnitRecord, 'title' | 'voting_region_id'>>({
    action: "create",
    resource: "voting_units",
    redirect: false,
  });

  const {
    modalProps: createRegionModalProps,
    formProps: createRegionFormProps,
    show: createRegionModalShow,
  } = useModalForm<Pick<RegionRecord, "title">>({
    action: "create",
    resource: "voting_regions",
    redirect: false,
  });

  const { result: manyVotingRegions, query: manyVotingRegionsQuery } = useMany({
    resource: "voting_regions",
    ids: tableProps?.dataSource?.map((record) => record.voting_region_id) ?? [],
  });

  const { selectProps: votingRegionsSelectProps } = useSelect<RegionRecord>({
    resource: "voting_regions",
    pagination: {
      pageSize: 48,
    },
  });

  return (
    <>
      <List
        title="Голосование / Участники"
        breadcrumb={null}
        createButtonProps={{
          hidden: true,
        }}
        headerButtons={() => (
          <Space>
            <Button
              onClick={() => {
                createUnitModalShow();
              }}
              type="primary"
            >
              Добавить поселение
            </Button>
            <Button
              onClick={() => {
                createRegionModalShow();
              }}
              type="default"
            >
              Добавить район
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
              dataIndex="voting_region_id"
              title="Район"
              sorter
              defaultSortOrder={getDefaultSortOrder("voting_region", sorters)}
              render={(value: string, record: UnitRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="last_name" style={{ margin: 0 }}>
                    <Input autoFocus size="small" />
                  </Form.Item>
                ) : manyVotingRegionsQuery.isLoading ? (
                  <TextField
                    value={record.voting_region}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <TextField
                    value={manyVotingRegions?.data?.find((unit) => unit.id == value)?.title}
                    style={{ cursor: "pointer" }}
                  />
                );
              }}
            />

            <Table.Column
              dataIndex="title"
              title="Поселение"
              sorter
              defaultSortOrder={getDefaultSortOrder("title", sorters)}
              render={(value: string, record: UnitRecord) => {
                return isEditing(record.id) ? (
                  <Form.Item name="first_name" style={{ margin: 0 }}>
                    <Input autoFocus size="small" defaultValue={value} />
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

      <Modal {...createRegionModalProps} title="Добавление района">
        <Form
          {...createRegionFormProps}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Flex gap={16}>
            <Form.Item
              label="Название"
              name="title"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </Flex>
        </Form>
      </Modal>

      <Modal {...createUnitModalProps} title="Добавление поселения">
        <Form
          {...createUnitFormProps}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Flex gap={16}>
            <Form.Item
              label="Название"
              name="title"
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
              label="Район"
              name="voting_region_id"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ flex: 1 }}
            >
              <Select {...votingRegionsSelectProps}>
                {votingRegionsSelectProps?.options?.map((option) => (
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

export default ListVotingUnits;
