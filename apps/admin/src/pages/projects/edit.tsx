import { Form, Input, Select, InputNumber } from "antd";
import { useForm, useSelect, Edit } from "@refinedev/antd";

export const EditProject = () => {
  const { formProps, saveButtonProps, query } = useForm({
    redirect: "show",
  });

  const record = query?.data?.data;

  const { selectProps: administrativeUnitProps } = useSelect({
    resource: "administrative_units",
    defaultValue: record?.administrative_unit_id,
    pagination: {
      pageSize: 48,
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Название" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Территория" name="administrative_unit_id">
          <Select {...administrativeUnitProps} />
        </Form.Item>
        <Form.Item label="Год реализации" name="year_of_completion">
          <InputNumber step="1" stringMode min={2010} max={2026} />
        </Form.Item>
        <Form.Item label="Широта" name="latitude">
          <Input pattern="\d*\.\d*" />
        </Form.Item>
        <Form.Item label="Долгота" name="longitude">
          <Input pattern="\d*\.\d*" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
