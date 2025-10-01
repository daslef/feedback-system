import { AuthPage } from "@refinedev/antd";
import { Image } from "antd";

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
      renderContent={(content) => (
        <div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Image
              src="/logos/logo_2022_black.svg"
              alt="Logo"
              style={{ maxWidth: "200px", height: "auto" }}
              preview={false}
            />
          </div>
          {content}
        </div>
      )}
    />
  );
};
