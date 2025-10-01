import type { OfficialRequest } from "../../types";

const officialRequestText = ({
  officialName,
  description,
  categoryTopic,
  createdAt,
}: Omit<OfficialRequest, "email" | "files">) => {
  const categoryText = !categoryTopic ? "" : `Категория: ${categoryTopic}`;

  return `Уважаемый ${officialName}! На платформу вместе47.рф поступило новое предложение.  Просим Вас принять меры для решения обозначенных в нем вопросов.

${categoryText}

Описание: ${description}

Дата и время обращения: ${createdAt}

Просим вас проинформировать о принятом по данному предложению решении посредством официальной электронной почты Центра компетенций Ленинградской области: cc.lenreg@sreda47.ru.

С наилучшими пожеланиями, команда Вместе47`;
};

export default officialRequestText;
