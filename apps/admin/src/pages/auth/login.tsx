import { AuthPage } from "@refinedev/antd";
import Image from "antd/es/image";

const Login = () => {
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
              style={{ maxWidth: "140px", height: "auto" }}
              preview={false}
            />
          </div>
          {content}
        </div>
      )}
    />
  );
};

export default Login;
