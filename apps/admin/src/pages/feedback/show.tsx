import { useShow, useUpdate, useList } from "@refinedev/core";
import { TextField, Show } from "@refinedev/antd";
import { Button, Space, Tag, Carousel } from "antd";

import { Typography, Card, Divider, message } from "antd";

export const ShowFeedback = () => {
  const {
    result: feedback,
    query: { isLoading },
  } = useShow();

  const { mutate: updateFeedback } = useUpdate();

  const { result: statuses } = useList({
    resource: "feedback_statuses",
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
    return status;
  };

  const handleApprove = () => {
    const approvedStatus = statuses?.data?.find(
      (status: any) => status.title === "approved",
    );
    if (!approvedStatus) {
      message.error("Статус 'approved' не найден");
      return;
    }

    updateFeedback(
      {
        resource: "feedback",
        id: feedback?.id,
        values: {
          feedback_status_id: approvedStatus.id,
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
      (status: any) => status.title === "declined",
    );
    if (!declinedStatus) {
      message.error("Статус 'declined' не найден");
      return;
    }

    updateFeedback(
      {
        resource: "feedback",
        id: feedback?.id,
        values: {
          feedback_status_id: declinedStatus.id,
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
    <Show isLoading={isLoading} title="Обращения">
      <Card>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: 1 }}>
            <Typography.Title level={4}>
              Информация об обращении
            </Typography.Title>

            <Typography.Title level={5}>Описание</Typography.Title>
            <TextField value={feedback?.description} />

            <Typography.Title level={5}>Территория</Typography.Title>
            <TextField value={feedback?.administrative_unit || "—"} />

            <Typography.Title level={5}>Проект</Typography.Title>
            <TextField value={feedback?.project} />

            <Typography.Title level={5}>Тип обращения</Typography.Title>
            <TextField value={feedback?.feedback_type} />

            <Typography.Title level={5}>Тема</Typography.Title>
            <TextField value={feedback?.topic || "—"} />

            <Typography.Title level={5}>Статус</Typography.Title>
            <Tag
              color={getStatusColor(feedback?.feedback_status)}
              style={{ marginBottom: "16px" }}
            >
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
            {images.length > 0 ? (
              <Carousel arrows={true} style={{ height: "400px" }}>
                {images.map((image: string, index: number) => (
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
            ) : (
              <div
                style={{
                  height: "400px",
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
          </div>
        </div>
      </Card>
    </Show>
  );
};
