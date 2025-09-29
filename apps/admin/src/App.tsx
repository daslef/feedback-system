import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { ConfigProvider, App as AntdApp } from "antd";
import { useTranslation } from "react-i18next";

import { Refine, Authenticated } from "@refinedev/core";
import routerProvider, { NavigateToResource } from "@refinedev/react-router";
import {
  RefineThemes,
  ThemedLayout,
  ThemedTitle,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";

import "./i18n";

import { dataProvider } from "./providers/data-provider";
import { authProvider } from "./providers/auth-provider";

import { ShowProject } from "./pages/projects/show";
import { EditProject } from "./pages/projects/edit";
import { ListProjects } from "./pages/projects/list";
import { CreateProject } from "./pages/projects/create";

import { ListTopicCategoryTopics } from "./pages/category-topics/list";
import { ListResponsibilities } from "./pages/responsibilities/list";

import { ListPersons } from "./pages/persons/list";
import { CreatePerson } from "./pages/persons/create";

import { ListFeedback } from "./pages/feedback/list";
import { ShowFeedback } from "./pages/feedback/show";

import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";

import "antd/dist/reset.css";

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
      <ConfigProvider theme={RefineThemes.Blue}>
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
                meta: { label: "Обращения" },
              },
              {
                name: "persons",
                list: "/persons",
                create: "/persons/create",
                meta: {
                  label: t("persons.persons"),
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
                name: "official_responsibilities",
                list: "/responsibilities",
                meta: {
                  label: "Ответственные",
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    redirectOnFail="/login"
                  >
                    <ThemedLayout
                      Title={(props) => (
                        <ThemedTitle
                          {...props}
                          text={t("documentTitle.default")}
                        />
                      )}
                      Sider={(props) => <ThemedSider {...props} />}
                    >
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="projects" />}
                />
                <Route path="/projects">
                  <Route index element={<ListProjects />} />
                  <Route path=":id" element={<ShowProject />} />
                  <Route path=":id/edit" element={<EditProject />} />
                  <Route path="create" element={<CreateProject />} />
                </Route>
                <Route path="/issues" element={<ListTopicCategoryTopics />}>
                  {" "}
                </Route>
                <Route path="/feedback">
                  <Route index element={<ListFeedback />} />
                  <Route path=":id" element={<ShowFeedback />} />
                </Route>
                <Route
                  path="/issues"
                  element={<ListTopicCategoryTopics />}
                ></Route>
                <Route
                  path="/responsibilities"
                  element={<ListResponsibilities />}
                ></Route>
                <Route path="/persons">
                  <Route index element={<ListPersons />} />
                  <Route path="create" element={<CreatePerson />} />
                </Route>
              </Route>
              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <NavigateToResource resource="projects" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
