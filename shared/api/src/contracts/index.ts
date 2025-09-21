import { oc } from "@orpc/contract";

import projectContract from "./project";
import administrativeUnitContract from "./administrativeUnit";
import topicContract from "./topic";
import topicCategoryContract from "./topicCategory";
import topicCategoryTopicContract from "./topicCategoryTopic";
import feedbackTypeContract from "./feedbackType";
import feedbackImageContract from "./feedbackImage";
import feedbackContract from "./feedback";
import personTypeContract from "./personType";
import personContract from "./person";
import personContactContract from "./personContact";

const apiContract = oc
  .errors({
    NOT_FOUND: {
      status: 404,
      message: "Ресурс не найден",
    },
    INPUT_VALIDATION_FAILED: {
      status: 422,
      message: "Некорректная схема входных данных",
    },
    METHOD_NOT_SUPPORTED: {
      message: "Ресурс не поддерживает данный метод",
    },
    INTERNAL_SERVER_ERROR: {
      message: "Внутренняя ошибка сервера",
    },
    CONFLICT: {
      message: "Ошибка обновления ресурса",
    },
    UNAUTHORIZED: {
      status: 401,
      message: "Не найдена пользовательская сессия",
    },
    FORBIDDEN: {
      status: 403,
      message: "Отсутствуют права для выполнения действия",
    },
  })
  .router({
    project: projectContract,
    administrativeUnit: administrativeUnitContract,
    feedbackType: feedbackTypeContract,
    feedbackImage: feedbackImageContract,
    topic: topicContract,
    topicCategory: topicCategoryContract,
    topicCategoryTopic: topicCategoryTopicContract,
    feedback: feedbackContract,
    personType: personTypeContract,
    person: personContract,
    personContact: personContactContract,
  });

export default apiContract;
