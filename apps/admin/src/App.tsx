import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { ConfigProvider, App as AntdApp } from "antd";

import { Refine, Authenticated } from "@refinedev/core";
import routerProvider, { NavigateToResource } from "@refinedev/react-router";
import {
  ThemedLayout,
  ThemedTitle,
  ThemedSider,
  useNotificationProvider,
} from "@refinedev/antd";

import { dataProvider } from "./providers/data-provider";
import { authProvider } from "./providers/auth-provider";

import { ShowProject } from "./pages/projects/show";
import { EditProject } from "./pages/projects/edit";
import { ListProjects } from "./pages/projects/list";
import { CreateProject } from "./pages/projects/create";

import { ListTopicCategories } from "./pages/topic-categories/list";
import { CreateTopicCategory } from "./pages/topic-categories/create";
import { ListFeedbackTopics } from "./pages/topics/list";
import { CreateFeedbackTopic } from "./pages/topics/create";
import { ListTopicCategoryTopics } from "./pages/category-topics/list";
import { CreateTopicCategoryTopic } from "./pages/category-topics/create";

import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";

import "antd/dist/reset.css";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <AntdApp>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "projects",
                list: "/projects",
                show: "/projects/:id",
                edit: "/projects/:id/edit",
                create: "/projects/create",
                meta: { label: "Проекты" },
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
                          text="Обратная связь вместе47"
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
