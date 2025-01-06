import {
  FacebookFilled,
  GoogleOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Flex, Typography } from "antd";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router";
const { Title } = Typography;
import { Link } from "react-router";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{ width: "100%", maxWidth: 600, marginInline: "auto" }}
    >
      <Title>Log In</Title>

      <Form
        name="login"
        style={{ width: "100%" }}
        onFinish={async (values) => {
          await login(values);
          navigate("/");
        }}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" size="large" htmlType="submit">
            Log In
          </Button>
          or <Link to="/signup">Sign up!</Link>
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
  );
}

export default Login;
