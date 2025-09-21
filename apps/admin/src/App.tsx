import { Refine } from "@refinedev/core";
import { dataProvider } from "./providers/data-provider";
import { ShowProject } from "./pages/projects/show";
import { EditProject } from "./pages/projects/edit";
import { ListProjects } from "./pages/projects/list";
import { ListTopicCategories } from "./pages/topic-categories/list";
import { CreateTopicCategory } from "./pages/topic-categories/create";
import { ListFeedbackTopics } from "./pages/topics/list";
import { CreateFeedbackTopic } from "./pages/topics/create";
import { ListTopicCategoryTopics } from "./pages/category-topics/list";
import { CreateTopicCategoryTopic } from "./pages/category-topics/create";

function App() {
  return (
    <Refine dataProvider={dataProvider}>
      <ShowProject />
      <EditProject />
      <ListProjects />
      <hr />
      <ListTopicCategories />
      <CreateTopicCategory />
      <hr />
      <ListFeedbackTopics />
      <CreateFeedbackTopic />
      <hr />
      <ListTopicCategoryTopics />
      <CreateTopicCategoryTopic />
    </Refine>
  );
}

export default App;
