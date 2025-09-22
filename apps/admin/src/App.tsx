import { Refine, Authenticated } from "@refinedev/core";
import { dataProvider } from "./providers/data-provider";
import { authProvider } from "./providers/auth-provider";

import { ShowProject } from "./pages/projects/show";
import { EditProject } from "./pages/projects/edit";
import { ListProjects } from "./pages/projects/list";
import { ListTopicCategories } from "./pages/topic-categories/list";
import { CreateTopicCategory } from "./pages/topic-categories/create";
import { ListFeedbackTopics } from "./pages/topics/list";
import { CreateFeedbackTopic } from "./pages/topics/create";
import { ListTopicCategoryTopics } from "./pages/category-topics/list";
import { CreateTopicCategoryTopic } from "./pages/category-topics/create";

import { Login } from "./pages/auth/login";
import { Register } from "./pages/auth/register";
import Header from "./components/header";

function App() {
  return (
    <Refine dataProvider={dataProvider} authProvider={authProvider}>
      {/* <ShowProject /> */}
      <ListProjects />
      <Register />

      <Authenticated key="protected" fallback={<Login />}>
        <Header />
        <EditProject />
      </Authenticated>
      {/* <hr />
      <ListTopicCategories />
      <CreateTopicCategory />
      <hr />
      <ListFeedbackTopics />
      <CreateFeedbackTopic />
      <hr />
      <ListTopicCategoryTopics />
      <CreateTopicCategoryTopic /> */}
    </Refine>
  );
}

export default App;
