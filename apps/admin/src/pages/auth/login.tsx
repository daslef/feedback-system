import { AuthPage } from "@refinedev/antd";
import { Image } from "antd";

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
      renderContent={(content) => (
        <div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <Image
              src="/logos/logo_2022_black.svg"
              alt="Logo"
              style={{ width: "100px", height: "100px" }}
              preview={false}
            />
          </div>
          {content}
        </div>
      )}
    />
  );
};
