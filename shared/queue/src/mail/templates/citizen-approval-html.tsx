import React from "react";

import {
  Body,
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
} from "@react-email/components";

interface Props {
  name: string;
}

const CitizenApprovalEmail = ({ name }: Props) => {
  return (
    <Html dir="ltr" lang="ru">
      <Tailwind>
        <Head />
        <Preview>Уважаемый житель! Ваше обращение принято в работу!</Preview>
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
                {name}!
              </Heading>

              <Text className="mb-[24px] text-[#0b0917] text-[16px]">
                Ваше предложение принято в работу. Благодарим Вас за вклад в
                благоустройство Ленинградской области!
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

CitizenApprovalEmail.PreviewProps = {
  name: "Антонина Юрьевна",
};

export default CitizenApprovalEmail;
