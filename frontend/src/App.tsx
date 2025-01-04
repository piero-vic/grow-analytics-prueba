import { Layout, Flex, Typography, Button } from "antd";
import { useAuth } from "./lib/auth";
const { Title } = Typography;

function App() {
  const { logout } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Content
        style={{ margin: "24px 16px", display: "flex", alignItems: "center" }}
      >
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ width: "100%", maxWidth: 600, marginInline: "auto" }}
        >
          <Title style={{ textAlign: "center" }}>Página protegida</Title>
          <Flex
            vertical
            align="center"
            justify="center"
            style={{ width: "100%", maxWidth: 600, marginInline: "auto" }}
          >
            <Button color="danger" variant="solid" onClick={() => logout()}>
              Logout
            </Button>
          </Flex>
        </Flex>
      </Layout.Content>
    </Layout>
  );
}

export default App;
