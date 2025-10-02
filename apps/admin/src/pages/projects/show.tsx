import { useShow } from "@refinedev/core";
import { TextField, NumberField, Show } from "@refinedev/antd";

import { Typography } from "antd";

export const ShowProject = () => {
  const {
    result: project,
    query: { isLoading },
  } = useShow();

  return (
    <Show isLoading={isLoading} breadcrumb={null}>
      <Typography.Title level={5}>Название</Typography.Title>
      <TextField value={project?.title} />

      <Typography.Title level={5}>Территория</Typography.Title>
      <TextField value={project?.administrative_unit} />

      <Typography.Title level={5}>Год реализации</Typography.Title>
      <TextField value={project?.year_of_completion} />

      <Typography.Title level={5}>Широта</Typography.Title>
      <NumberField value={project?.latitude} />

      <Typography.Title level={5}>Долгота</Typography.Title>
      <NumberField value={project?.longitude} />
    </Show>
  );
};
