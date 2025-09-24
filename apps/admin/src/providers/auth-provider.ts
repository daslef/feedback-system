import { type AuthProvider } from "@refinedev/core";
import { createAuthClient } from "@shared/auth";

const authClient = createAuthClient({
  apiBasePath: "/api",
  apiBaseUrl: "http://localhost:3000",
});

const authProvider: AuthProvider = {
  check: async () => {
    const { data: session, error } = await authClient.getSession();

    return { authenticated: Boolean(session) };
  },
  register: async ({ email, password }) => {
    const { data, error } = await authClient.signUp.email({
      name: email,
      email,
      password,
      fetchOptions: {
        onError: (error) => {
          throw error;
        },
      },
    });

    if (data?.token) {
      return { success: true, redirectTo: "/" };
    }

    return { success: false };
  },
  login: async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (data?.token) {
      return { success: true, redirectTo: "/" };
    }

    return { success: false };
  },
  logout: async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onError: (error) => {
            throw error;
          },
        },
      });
      return { success: true, redirectTo: "/login" };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
  onError: async (error) => {
    if (error?.status === 401) {
      return {
        logout: true,
        error: {
          message: "Ошибка прав доступа",
          name: "Error",
          statusCode: error?.status ?? 403,
        },
      };
    }

    return {};
  },
  getIdentity: async () => {
    const { data } = await authClient.getSession();

    return data?.user ?? null;
  },
  // ...
};

export { authProvider };
