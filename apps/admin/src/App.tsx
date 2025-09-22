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
import { ConfigProvider, App as AntdApp } from "antd";
import {
  RefineThemes,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";
import { dataProvider } from "./providers/data-provider";
import { PersonList } from "./pages/person/list-antd";

type RouteConfig = {
  path: RoutePath;
  label: string;
  element: ReactNode;
  section: string;
};

type RoutePath = "/persons";

const ROUTES: RouteConfig[] = [
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

const DEFAULT_PATH: RoutePath = "/persons";

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

  return <>{activeRoute.element}</>;
};

const Layout: FC = () => (
  <ThemedLayout>
    <ContentArea />
  </ThemedLayout>
);

function App() {
  return (
    <ConfigProvider theme={RefineThemes.Blue}>
      <AntdApp>
        <RouterProvider>
          <Refine
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "persons",
                list: "/persons",
                meta: {
                  label: "Пользователи",
                },
              },
            ]}
            options={{ syncWithLocation: false }}
          >
            <Layout />
          </Refine>
        </RouterProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
