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
    });
  },
  login: async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    if (data?.token) {
      return { success: true };
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
    } catch (error) {
      console.error(error);
      return { success: false };
    }

    return { success: true };
  },
  onError: async (error) => {
    throw new Error("Not implemented");
  },
  getIdentity: async () => {
    const { data } = await authClient.getSession();

    return data?.user ?? null;
  },
  // ...
};

export { authProvider };
