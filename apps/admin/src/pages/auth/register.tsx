import { AuthPage } from "@refinedev/antd";

export const Register = () => {
  return (
    <AuthPage
      type="register"
      formProps={{
        initialValues: {
          email: "admin2@example.com",
          password: "admin2password",
        },
      }}
      title="Регистрация"
    />
  );
};
