import {
  FacebookFilled,
  GoogleOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Layout, Button, Form, Input, Flex, Checkbox, Typography } from "antd";
const { Title } = Typography;

function App() {
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
          <Title>Sign up</Title>

          <Form name="login" style={{ width: "100%" }}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input type="password" placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" size="large" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>

          <Flex vertical gap="small" align="center">
            Or login with
            <Flex gap="small">
              <Button
                size="large"
                icon={<FacebookFilled style={{ color: "#1877F2" }} />}
              />
              <Button
                size="large"
                icon={<TwitterOutlined style={{ color: "#3399FF" }} />}
              />
              <Button
                size="large"
                icon={<GoogleOutlined style={{ color: "#EA4335" }} />}
              />
            </Flex>
          </Flex>
        </Flex>
      </Layout.Content>
    </Layout>
  );
}

export default App;
