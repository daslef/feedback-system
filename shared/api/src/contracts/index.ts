import { oc } from "@orpc/contract";

import topicContract from "./topic";
import topicCategoryContract from "./topicCategory";
import topicCategoryTopicContract from "./topicCategoryTopic";

import feedbackTypeContract from "./feedbackType";
import feedbackStatusContract from "./feedbackStatus";
import feedbackContract from "./feedback";

import administrativeUnitContract from "./administrativeUnit";
import administrativeUnitTypeContract from "./administrativeUnitType";

import personTypeContract from "./personType";
import personContract from "./person";

import officialResponsibilityContract from "./officialResponsibility";

import projectContract from "./project";

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
    topic: topicContract,
    topicCategory: topicCategoryContract,
    topicCategoryTopic: topicCategoryTopicContract,

    feedback: feedbackContract,
    feedbackType: feedbackTypeContract,
    feedbackStatus: feedbackStatusContract,

    personType: personTypeContract,
    person: personContract,

    administrativeUnit: administrativeUnitContract,
    administrativeUnitType: administrativeUnitTypeContract,

    project: projectContract,
    
    officialResponsibility: officialResponsibilityContract,
  });

export default apiContract;
