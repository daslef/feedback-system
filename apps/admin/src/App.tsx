import { Refine } from "@refinedev/core";
import { dataProvider } from "./providers/data-provider";
import { ShowProject } from "./pages/projects/show";
import { EditProject } from "./pages/projects/edit";
import { ListProjects } from "./pages/projects/list";

function App() {
  return (
    <Refine dataProvider={dataProvider}>
      <ShowProject />
      <EditProject />
      <ListProjects />
    </Refine>
  );
}

export default App;
