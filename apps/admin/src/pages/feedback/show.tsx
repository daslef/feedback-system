import { useShow, useUpdate, useList } from "@refinedev/core";
import { TextField, Show } from "@refinedev/antd";

import {
  Button,
  Space,
  Tag,
  Carousel,
  Typography,
  Card,
  Divider,
  message,
  Flex,
  Image,
} from "antd";

type Status = {
  id: number;
  title: "pending" | "approved" | "declined";
};

export const ShowFeedback = () => {
  const {
    result: feedback,
    query: { isLoading },
  } = useShow();

  const { mutate: updateFeedback } = useUpdate();

  const { result: statuses } = useList<Status>({
    resource: "feedback_statuses",
    pagination: {
      pageSize: 48,
    },
  });

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "orange",
      approved: "green",
      declined: "red",
    };
    return colorMap[status] || "default";
  };

  const getStatusText = (status: string) => {
    return {
      pending: "В обработке",
      approved: "Утверждено",
      declined: "Отклонено",
    }[status];
  };

  const handleApprove = () => {
    const approvedStatus = statuses?.data?.find(
      (status) => status.title === "approved",
    );

    updateFeedback(
      {
        resource: "feedback",
        id: feedback?.id,
        values: {
          feedback_status_id: approvedStatus?.id,
        },
      },
      {
        onSuccess: () => {
          message.success("Обращение согласовано");
        },
        onError: () => {
          message.error("Ошибка при согласовании обращения");
        },
      },
    );
  };

  const handleDecline = () => {
    const declinedStatus = statuses?.data?.find(
      (status) => status.title === "declined",
    );

    updateFeedback(
      {
        resource: "feedback",
        id: feedback?.id,
        values: {
          feedback_status_id: declinedStatus?.id,
        },
      },
      {
        onSuccess: () => {
          message.success("Обращение отклонено");
        },
        onError: () => {
          message.error("Ошибка при отклонении обращения");
        },
      },
    );
  };

  const images: string[] = feedback?.image_links || [];

  return (
    <Show isLoading={isLoading} title="Обращения" breadcrumb={null}>
      <Typography.Title level={3}>Обращение №{feedback?.id}</Typography.Title>

      <Flex align="stretch">
        <Card
          variant={"borderless"}
          style={{
            boxShadow: "none",
            flex: "1 0 max-content",
          }}
        >
          <Typography.Title level={5}>Тип обращения</Typography.Title>
          <TextField value={feedback?.feedback_type} />

          <Typography.Title level={5}>Тема</Typography.Title>
          <TextField value={feedback?.topic || "—"} />

          <Typography.Title level={5}>Описание</Typography.Title>
          <TextField value={feedback?.description} />

          <Typography.Title level={5}>Территория</Typography.Title>
          <TextField value={feedback?.administrative_unit || "—"} />

          <Typography.Title level={5}>Проект</Typography.Title>
          <TextField value={feedback?.project} />

          <Typography.Title level={5}>
            Ответственный за территорию
          </Typography.Title>
          <TextField value={feedback?.responsible_person_full_name || "—"} />

          <Typography.Title level={5}>Дата создания</Typography.Title>
          <TextField
            value={new Date(feedback?.created_at).toLocaleString("ru-RU")}
          />

          <Typography.Title level={5}>Статус</Typography.Title>
          <Tag
            color={getStatusColor(feedback?.feedback_status)}
            style={{ marginBottom: "16px" }}
          >
            {getStatusText(feedback?.feedback_status)}
          </Tag>
        </Card>

        <Card
          variant="borderless"
          style={{ width: "55%", boxShadow: "none", gap: 24 }}
        >
          <Flex vertical>
            <Typography.Title level={4}>Респондент</Typography.Title>

            <Typography.Title level={5}>ФИО</Typography.Title>
            <TextField value={feedback?.person_full_name || "—"} />

            <Typography.Title level={5}>Email</Typography.Title>
            <TextField value={feedback?.person_email || "—"} />

            <Typography.Title level={5}>Телефон</Typography.Title>
            <TextField value={feedback?.person_phone || "—"} />

            <Divider />

            <Typography.Title level={4}>Фотографии</Typography.Title>

            {images.length > 0 ? (
              <Image.PreviewGroup>
                {images.map((image: string, index: number) => {
                  return (
                    <Image
                      key={`image_${index}`}
                      height={180}
                      src={image}
                      preview={{ getContainer: "#root" }}
                    />
                  );
                })}
              </Image.PreviewGroup>
            ) : (
              <div
                style={{
                  height: 180,
                  width: 240,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  border: "2px dashed #d9d9d9",
                }}
              >
                <Typography.Text type="secondary">
                  Фотографии не прикреплены
                </Typography.Text>
              </div>
            )}
          </Flex>
        </Card>
      </Flex>

      <Divider />

      {feedback?.feedback_status === "pending" && (
        <Space>
          <Button type="primary" onClick={handleApprove}>
            Согласовать
          </Button>
          <Button danger onClick={handleDecline}>
            Отклонить
          </Button>
        </Space>
      )}
    </Show>
  );
};
