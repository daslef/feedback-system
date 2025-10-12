import { BrowserRouter } from "react-router";
import AntdApp from "antd/es/app";
import ConfigProvider from "antd/es/config-provider";
import { useTranslation } from "react-i18next";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { useNotificationProvider } from "@refinedev/antd";

import "./i18n";

import { dataProvider } from "./providers/data-provider";
import { authProvider } from "./providers/auth-provider";

import "antd/dist/reset.css";
import AppRoutes from "./routes";

interface I18nProvider {
  translate: (key: string, params?: any) => string;
  changeLocale: (lang: string) => void;
  getLocale: () => string;
}

function App() {
  const { t } = useTranslation();

  const i18nProvider: I18nProvider = {
    translate: (key: string, params?: any) => {
      return String(t(key, params));
    },
    changeLocale: (_: string) => {},
    getLocale: () => {
      return "ru";
    },
  };

  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677FF",
            fontFamily: "MuseoSansCyrl",
          },
        }}
      >
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            i18nProvider={i18nProvider}
            resources={[
              {
                name: "projects",
                list: "/projects",
                show: "/projects/:id",
                edit: "/projects/:id/edit",
                create: "/projects/create",
                meta: { label: t("projects.projects") },
              },
              {
                name: "feedback",
                list: "/feedback",
                show: "/feedback/:id",
                meta: { label: "Предложения" },
              },
              {
                name: "persons",
                list: "/persons",
                meta: {
                  parent: "Пользователи",
                  label: "Респонденты",
                },
              },
              {
                name: "officials",
                list: "/officials",
                meta: {
                  parent: "Пользователи",
                  label: "Администрация",
                },
              },
              {
                name: "topic_category_topics",
                list: "/issues",
                meta: {
                  label: "Категории",
                },
              },
              {
                name: "administrative_units",
                list: "/administrative_units",
                meta: {
                  label: "Поселения",
                },
              },
            ]}
          >
            <AppRoutes />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
