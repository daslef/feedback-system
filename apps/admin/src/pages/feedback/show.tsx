import { useShow, useUpdate } from "@refinedev/core";
import { TextField, Show } from "@refinedev/antd";
import { Button, Space, Tag, Carousel } from "antd";

import { Typography, Card, Divider, message } from "antd";

export const ShowFeedback = () => {
  const {
    result: feedback,
    query: { isLoading },
  } = useShow();

  const { mutate: updateFeedback } = useUpdate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "approved":
        return "green";
      case "declined":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "На рассмотрении";
      case "approved":
        return "Согласовано";
      case "declined":
        return "Отклонено";
      default:
        return status;
    }
  };

  const handleApprove = () => {
    updateFeedback(
      {
        resource: "feedback",
        id: feedback?.id,
        values: {
          feedback_status_id: 1,
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
    updateFeedback(
      {
        resource: "feedback",
        id: feedback?.id,
        values: {
          feedback_status_id: 2,
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

  const sampleImages = [
    "https://picsum.photos/400/300?random=1",
    "https://picsum.photos/400/300?random=2",
    "https://picsum.photos/400/300?random=3",
    "https://picsum.photos/400/300?random=4",
    "https://picsum.photos/400/300?random=5",
  ];

  return (
    <Show isLoading={isLoading} title="Обращения">
      <Card>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: 1 }}>
            <Typography.Title level={4}>
              Информация об обращении
            </Typography.Title>

            <Typography.Title level={5}>Описание</Typography.Title>
            <TextField value={feedback?.description} />

            <Typography.Title level={5}>Проект</Typography.Title>
            <TextField value={feedback?.project} />

            <Typography.Title level={5}>Тип обращения</Typography.Title>
            <TextField value={feedback?.feedback_type} />

            <Typography.Title level={5}>Тема</Typography.Title>
            <TextField value={feedback?.topic || "—"} />

            <Typography.Title level={5}>Статус</Typography.Title>
            <Tag color={getStatusColor(feedback?.feedback_status)} style={{marginBottom: "16px" }}>
              {getStatusText(feedback?.feedback_status)}
            </Tag>

            <Typography.Title level={5}>Дата создания</Typography.Title>
            <TextField
              value={new Date(feedback?.created_at).toLocaleString("ru-RU")}
            />

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
          </div>

          <div style={{ width: "700px" }}>
            <Typography.Title level={4}>Фотографии</Typography.Title>
            <Carousel arrows={true} style={{ height: "400px" }}>
              {sampleImages.map((image, index) => (
                <div key={index}>
                  <div
                    style={{
                      height: "400px",
                      backgroundImage: `url(${image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: "8px",
                    }}
                  ></div>
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </Card>
    </Show>
  );
};
