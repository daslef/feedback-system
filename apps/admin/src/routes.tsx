import React from "react";
import { Routes, Route, Outlet } from "react-router";

import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/react-router";

import { ThemedLayout } from "./components/layout";
import { ThemedSider } from "./components/layout/sider";
import { ThemedTitle } from "./components/layout/title";

const ShowProject = React.lazy(() => import("./pages/projects/show"));
const EditProject = React.lazy(() => import("./pages/projects/edit"));
const ListProjects = React.lazy(() => import("./pages/projects/list"));
const CreateProject = React.lazy(() => import("./pages/projects/create"));

const ListTopicCategoryTopics = React.lazy(
  () => import("./pages/category-topics/list"),
);

const ListAdministrativeUnits = React.lazy(
  () => import("./pages/administrative-units/list"),
);

const ListPersons = React.lazy(() => import("./pages/persons/list"));
const ListOfficials = React.lazy(() => import("./pages/officials/list"));

const ListFeedback = React.lazy(() => import("./pages/feedback/list"));
const ShowFeedback = React.lazy(() => import("./pages/feedback/show"));

const ListVotingResults = React.lazy(() => import("./pages/voting-results/list"));
const ListVotingUnits = React.lazy(() => import("./pages/voting-units/list"));

const Login = React.lazy(() => import("./pages/auth/login"));
const Register = React.lazy(() => import("./pages/auth/register"));

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <Authenticated key="authenticated-routes" redirectOnFail="/login">
            <ThemedLayout
              Title={ThemedTitle}
              Sider={(props) => <ThemedSider {...props} fixed />}
            >
              <Outlet />
            </ThemedLayout>
          </Authenticated>
        }
      >
        <Route index element={<NavigateToResource resource="projects" />} />
        <Route path="/projects">
          <Route index element={<ListProjects />} />
          <Route path=":id" element={<ShowProject />} />
          <Route path=":id/edit" element={<EditProject />} />
          <Route path="create" element={<CreateProject />} />
        </Route>
        <Route path="/issues" element={<ListTopicCategoryTopics />} />
        <Route
          path="/administrative_units"
          element={<ListAdministrativeUnits />}
        />
        <Route path="/feedback">
          <Route index element={<ListFeedback />} />
          <Route path=":id" element={<ShowFeedback />} />
        </Route>
        <Route path="/persons" element={<ListPersons />} />
        <Route path="/officials" element={<ListOfficials />} />

        <Route path="/voting-results" element={<ListVotingResults />} />
        <Route path="/voting-units" element={<ListVotingUnits />} />

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
  );
}
