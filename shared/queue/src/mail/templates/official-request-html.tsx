import React from "react";

import type { OfficialRequest } from "../../types";

import {
  Body,
  CodeInline,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  Link
} from "@react-email/components";

const OfficialRequestEmail = ({
  officialName,
  description,
  createdAt,
  categoryTopic,
  files,
}: Omit<OfficialRequest, "email">) => {
  return (
    <Html dir="ltr" lang="ru">
      <Tailwind>
        <Head />
        <Preview>
          Уважаемый {officialName}! На платформу вместе47.рф поступило новое
          предложение.
        </Preview>
        <Body className="bg-[#f2f2fa] py-[40px] font-sans">
          <Container className="mx-auto max-w-[720px] rounded-[8px] bg-white px-[40px] py-[40px]">
            <Section className="mb-[32px] text-center">
              <Img
                alt="логотип"
                className="mx-auto h-auto w-full max-w-[120px]"
                src="https://minio.xn--47-dlckcacbiv4afwllqms4x.xn--p1ai/photos/2025-10-01T03:27:09.294Z_logo.png"
              />
            </Section>

            <Section>
              <Heading className="mb-[24px] text-center text-[#0b0917] text-[18px]">
                Уважаемый {officialName}!
              </Heading>

              <Text className="mb-[24px] text-[#0b0917] text-[16px]">
                На платформу вместе47.рф поступило новое предложение. Просим Вас
                принять меры для решения обозначенных в нем вопросов.
              </Text>

              <Section className="mb-[24px] rounded-[0px] border-[#e6e6f0] border-[1px] border-solid bg-[#f8f8ff] p-[18px]">
                {categoryTopic && (
                  <>
                    <Heading className="mb-[12px] font-bold text-[#0b0917] text-[18px]">
                      Категория
                    </Heading>
                    <Text className="m-0 mb-[16px] text-[#0b0917] text-[14px] leading-[20px]">
                      {categoryTopic}
                    </Text>
                  </>
                )}
                <Heading className="mb-[12px] font-bold text-[#0b0917] text-[18px]">
                  Описание
                </Heading>
                <Text className="m-0 mb-[16px] text-[#0b0917] text-[14px] leading-[20px]">
                  {description}
                </Text>
                <Heading className="mb-[12px] font-bold text-[#0b0917] text-[18px]">
                  Дата и время обращения
                </Heading>
                <Text className="m-0 mb-[16px] text-[#0b0917] text-[14px] leading-[20px]">
                  {createdAt.toString()}
                </Text>
                {files.length && <Heading className="mb-[12px] font-bold text-[#0b0917] text-[18px]">
                  Фотографии
                </Heading>}
                {files.map((file, index) => <Link href={file} key={`photo_${index}`}>{"Фото " + String(index + 1)}</Link>)}
              </Section>

              <Text className="mb-[20px] text-[#0b0917] text-[16px] leading-[24px]">
                Просим вас проинформировать о принятом по данному предложению
                решении посредством официальной электронной почты Центра
                компетенций Ленинградской области:{" "}
                <CodeInline>cc.lenreg@sreda47.ru</CodeInline>.
              </Text>
            </Section>

            <Hr className="my-[32px] border-[#e6e6f0]" />

            <Text className="text-[#0b0917] text-[16px] leading-[24px]">
              С наилучшими пожеланиями, команда Вместе47
            </Text>

            <Text className="m-0 mt-[16px] text-[#666666] text-[12px] leading-[16px]">
              © Вместе47.рф
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OfficialRequestEmail.PreviewProps = {
  officialName: "Аркадий Григорьевич",
  description:
    "Прошу организовать ремонт дорожного покрытия участка дороги длиной 260 м. от перекрестка с ул. Менделеева до перекрестка с ул. 39-я Гвардейская.\r\nВ настоящее время твердое покрытие дороги на данном участке практически отсутствует, ширина ям достигает двух метров, глубина достигает 15-20 см, что нарушает требования нормативов ГОСТ Р 50597-93.\r\nВ случае отсутствия возможности организации ремонта прошу дать пояснения относительно причин и разъяснить порядок дальнейших действий для организации ремонта данного участка дороги.",
  createdAt: "24 сентября 2025 г.",
  categoryTopic: {
    category: "Дороги",
    topic: "Ремонт покрытия",
  },
};

export default OfficialRequestEmail;
