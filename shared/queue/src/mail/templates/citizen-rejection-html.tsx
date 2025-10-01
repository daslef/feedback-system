import * as React from "react";

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface Props {
  name: string;
}

const CitizenRejectionEmail = ({ name }: Props) => {
  return (
    <Html dir="ltr" lang="ru">
      <Tailwind>
        <Head />
        <Preview>
          Уважаемый житель, Ваше обращение нуждается в уточнении
        </Preview>
        <Body className="bg-[#f2f2fa] py-[40px] font-sans">
          <Container className="mx-auto max-w-[720px] rounded-[8px] bg-white px-[40px] py-[40px]">
            <Section className="mb-[32px] text-center">
              <Img
                alt="вместе47"
                className="mx-auto h-auto w-full max-w-[120px]"
                src="https://xn--47-dlcma4bxbi.xn--p1ai/templates/vote/img/logo_2022_black.svg"
              />
            </Section>

            <Section>
              <Heading className="mb-[24px] text-center text-[#0b0917] text-[18px]">
                {name}!
              </Heading>

              <Text className="mb-[20px] text-[#0b0917] text-[16px] leading-[24px]">
                К сожалению, Ваше обращение было отклонено нашими модераторами
                по причине несоответствия требованиям. Пожалуйста, ознакомьтесь
                с требованиями, указанными ниже
              </Text>

              <Section className="mb-[24px] rounded-[0px] border-[#e6e6f0] border-[1px] border-solid bg-[#f8f8ff] p-[18px]">
                <Heading className="mb-[16px] font-bold text-[#0b0917] text-[16px]">
                  Требования к обратной связи по благоустройству
                </Heading>
                <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
                  • предложение относится к сфере благоустройства городов
                  Ленинградской области;
                </Text>
                <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
                  • предложение относится к территории, благоустроенной в рамках
                  государственной программы «Формирование городской среды и
                  обеспечение качественным жильем граждан на территории
                  Ленинградской области», утвержденной постановлением
                  Правительства Ленинградской области от 14.11.2013 №407;
                </Text>
                <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
                  • соблюдение этических норм общения — использование
                  ненормативной лексики и оскорбительных выражений не
                  допускается;
                </Text>
                <Text className="m-0 mb-[12px] text-[#0b0917] text-[14px] leading-[20px]">
                  • описание предложения максимально подробно, избегая общих
                  фраз («У нас всё плохо», «Сделайте красиво», «Здесь
                  некомфортно» и т.п.).
                </Text>
              </Section>
            </Section>

            <Hr className="my-[32px] border-[#e6e6f0]" />

            <Text className="text-[#0b0917] text-[16px] leading-[24px]">
              С наилучшими пожеланиями,
              <br />
              команда Вместе47
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

CitizenRejectionEmail.PreviewProps = {
  name: "Алексей Вячеславович",
};

export default CitizenRejectionEmail;
