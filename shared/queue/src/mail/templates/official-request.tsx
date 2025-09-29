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
  message: string;
  name: string;
}

const OfficialRequestEmail = ({ message, name }: Props) => {
  return (
    <Html dir="ltr" lang="ru">
      <Tailwind>
        <Head />
        <Preview>
          Уважаемый {name}! Было зарегистрировано новое обращение от жителя.
        </Preview>
        <Body className="bg-[#f2f2fa] py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white px-[40px] py-[40px]">
            <Section className="mb-[32px] text-center">
              <Img
                alt="Foneflip"
                className="mx-auto h-auto w-full max-w-[200px]"
                src="https://di867tnz6fwga.cloudfront.net/brand-kits/453a191a-fef2-4ba6-88fe-b9e7a16650cd/primary/a14c98ef-2a94-4c00-91e4-6e1dedfcd261.png"
              />
            </Section>

            <Section>
              <Heading className="mb-[24px] text-center font-bold text-[#0b0917] text-[28px]">
                Уважаемый {name}! Было зарегистрировано новое обращение от
                жителя.
              </Heading>

              <Text className="mb-[20px] text-[#0b0917] text-[16px] leading-[24px]">
                {message}
              </Text>

              <Text className="text-[#0b0917] text-[16px] leading-[24px]">
                С наилучшими пожеланиями,
                <br />
                команда Вместе47
              </Text>
            </Section>

            <Hr className="my-[32px] border-[#e6e6f0]" />

            <Section>
              <Row>
                <Column className="text-right">
                  <Link
                    className="mr-[8px] inline-block"
                    href="https://вместе47.рф/"
                  >
                    <Img
                      alt="Instagram"
                      className="h-[24px] w-[24px]"
                      src="https://new.email/static/emails/social/social-instagram.png"
                    />
                  </Link>
                </Column>
              </Row>

              <Text className="m-0 mt-[16px] text-[#666666] text-[12px] leading-[16px]">
                © Вместе47.рф
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OfficialRequestEmail.PreviewProps = {
  message: "Неполадки с оборудованием",
  name: "Аркадий Григорьевич",
};

export default OfficialRequestEmail;
