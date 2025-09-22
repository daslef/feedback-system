import { Refine } from "@refinedev/core";
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type FC,
} from "react";
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
import { PersonList } from "./pages/person/list";

type RouteConfig = {
  path: RoutePath;
  label: string;
  element: ReactNode;
  section: string;
};

type RoutePath =
  | "/projects"
  | "/projects/show"
  | "/projects/edit"
  | "/topic-categories"
  | "/topic-categories/create"
  | "/topics"
  | "/topics/create"
  | "/category-topics"
  | "/category-topics/create"
  | "/persons";

const ROUTES: RouteConfig[] = [
  {
    path: "/projects",
    label: "Список проектов",
    section: "Проекты",
    element: <ListProjects />,
  },
  {
    path: "/projects/show",
    label: "Просмотр проекта",
    section: "Проекты",
    element: <ShowProject />,
  },
  {
    path: "/projects/edit",
    label: "Редактирование проекта",
    section: "Проекты",
    element: <EditProject />,
  },
  {
    path: "/topic-categories",
    label: "Категории тем",
    section: "Тематики",
    element: <ListTopicCategories />,
  },
  {
    path: "/topic-categories/create",
    label: "Создать категорию",
    section: "Тематики",
    element: <CreateTopicCategory />,
  },
  {
    path: "/topics",
    label: "Темы обращений",
    section: "Тематики",
    element: <ListFeedbackTopics />,
  },
  {
    path: "/topics/create",
    label: "Создать тему",
    section: "Тематики",
    element: <CreateFeedbackTopic />,
  },
  {
    path: "/category-topics",
    label: "Темы по категориям",
    section: "Тематики",
    element: <ListTopicCategoryTopics />,
  },
  {
    path: "/category-topics/create",
    label: "Связать тему с категорией",
    section: "Тематики",
    element: <CreateTopicCategoryTopic />,
  },
  {
    path: "/persons",
    label: "Пользователи",
    section: "Пользователи",
    element: <PersonList />,
  },
];

type RouterContextValue = {
  path: RoutePath;
  navigate: (to: RoutePath, options?: { replace?: boolean }) => void;
  availablePaths: RoutePath[];
};

const RouterContext = createContext<RouterContextValue | null>(null);

const DEFAULT_PATH: RoutePath = "/projects";

const useIsBrowser = () => typeof window !== "undefined";

const RouterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const isBrowser = useIsBrowser();
  const availablePaths = useMemo(() => ROUTES.map((route) => route.path), []);

  const getInitialPath = useCallback((): RoutePath => {
    if (!isBrowser) return DEFAULT_PATH;
    const currentPath = window.location.pathname as RoutePath;
    return availablePaths.includes(currentPath) ? currentPath : DEFAULT_PATH;
  }, [availablePaths, isBrowser]);

  const [path, setPath] = useState<RoutePath>(getInitialPath);

  useEffect(() => {
    if (!isBrowser) return;
    const handlePopState = () => {
      const nextPath = window.location.pathname as RoutePath;
      setPath(availablePaths.includes(nextPath) ? nextPath : DEFAULT_PATH);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [availablePaths, isBrowser]);

  useEffect(() => {
    if (!isBrowser) return;
    const currentPath = window.location.pathname as RoutePath;
    if (currentPath !== path) {
      window.history.replaceState({}, "", path);
    }
  }, [isBrowser, path]);

  const navigate = useCallback<RouterContextValue["navigate"]>(
    (to, options) => {
      setPath((prev) => {
        if (prev === to) return prev;
        if (isBrowser) {
          if (options?.replace) {
            window.history.replaceState({}, "", to);
          } else {
            window.history.pushState({}, "", to);
          }
        }
        return to;
      });
    },
    [isBrowser],
  );

  const value = useMemo<RouterContextValue>(
    () => ({ path, navigate, availablePaths }),
    [availablePaths, navigate, path],
  );

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
};

const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used inside RouterProvider");
  }
  return context;
};

const Navigation: FC = () => {
  const { path, navigate } = useRouter();

  const sections = useMemo(() => {
    const grouped = new Map<string, RouteConfig[]>();
    for (const route of ROUTES) {
      if (!grouped.has(route.section)) {
        grouped.set(route.section, []);
      }
      grouped.get(route.section)!.push(route);
    }

    return Array.from(grouped.entries()).map(([section, routes]) => ({
      section,
      routes,
    }));
  }, []);

  return (
    <nav className="app-sider">
      <div className="app-brand">refine admin</div>
      {sections.map(({ section, routes }) => (
        <div className="app-nav-section" key={section}>
          <div className="app-nav-section-title">{section}</div>
          <ul className="app-nav-list">
            {routes.map((route) => (
              <li key={route.path}>
                <button
                  className={`app-nav-link${path === route.path ? " active" : ""}`}
                  type="button"
                  onClick={() => navigate(route.path)}
                >
                  {route.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

const ContentArea: FC = () => {
  const { path, navigate, availablePaths } = useRouter();
  const activeRoute = useMemo(
    () =>
      ROUTES.find((route) => route.path === path) ??
      ROUTES.find((route) => route.path === DEFAULT_PATH)!,
    [path],
  );

  useEffect(() => {
    if (!availablePaths.includes(path)) {
      navigate(DEFAULT_PATH, { replace: true });
    }
  }, [availablePaths, navigate, path]);

  return <div className="app-content">{activeRoute.element}</div>;
};

const Layout: FC = () => (
  <div className="app-layout">
    <Navigation />
    <ContentArea />
  </div>
);

function App() {
  return (
    <RouterProvider>
      <Refine dataProvider={dataProvider} options={{ syncWithLocation: false }}>
        <Layout />
      </Refine>
    </RouterProvider>
  );
}

export default App;
