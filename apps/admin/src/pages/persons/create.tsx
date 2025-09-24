import { Form, Input, Select } from "antd";
import { useForm, useSelect, Create } from "@refinedev/antd";

export const CreatePerson = () => {
  const { formProps, saveButtonProps } = useForm();

  const { selectProps: personTypeProps } = useSelect({
    resource: "person_types",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Фамилия" name="last_name">
          <Input required />
        </Form.Item>
        <Form.Item label="Имя" name="first_name">
          <Input required />
        </Form.Item>
        <Form.Item label="Отчество" name="middle_name">
          <Input required />
        </Form.Item>
        <Form.Item label="Тип" name="person_type_id">
          <Select {...personTypeProps} />
        </Form.Item>
        <Form.Item label="Почта" name="email">
          <Input type="email" required />
        </Form.Item>
        <Form.Item label="Телефон" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Соцсеть" name="social">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
};
