import { AuthPage } from "@refinedev/antd";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      formProps={{
        initialValues: {
          email: "admin2@example.com",
          password: "admin2password",
        },
      }}
      title="Аутентификация"
    />
  );
};
