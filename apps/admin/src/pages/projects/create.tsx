import Form from "antd/es/form";
import Input from "antd/es/input";
import Select from "antd/es/select";
import InputNumber from "antd/es/input-number";

import { useForm, useSelect, Create } from "@refinedev/antd";

const CreateProject = () => {
  const { formProps, saveButtonProps } = useForm();

  const { selectProps: administrativeUnitProps } = useSelect({
    resource: "administrative_units",
    pagination: {
      pageSize: 48,
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps} breadcrumb={null}>
      <Form {...formProps} layout="vertical" style={{ maxWidth: 480 }}>
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
    </Create>
  );
};

export default CreateProject;
