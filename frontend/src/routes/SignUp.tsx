import { Layout, Button, Form, Input, Flex, Typography } from "antd";
import { useAuth } from "../lib/auth";
import { useNavigate } from "react-router";
const { Title } = Typography;
import { Link } from "react-router";

function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();

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
          <Title>Sign Up</Title>

          <Form
            name="signup"
            style={{ width: "100%" }}
            onFinish={async (values) => {
              await signup(values);
              navigate("/");
            }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
              name="paternalLastName"
              rules={[
                {
                  required: true,
                  message: "Please input your paternal last name!",
                },
              ]}
            >
              <Input placeholder="Paternal last name" />
            </Form.Item>

            <Form.Item
              name="maternalLastName"
              rules={[
                {
                  required: true,
                  message: "Please input your maternal last name!",
                },
              ]}
            >
              <Input placeholder="Maternal last name" />
            </Form.Item>

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
              <Button block type="primary" size="large" htmlType="submit">
                Sign Up
              </Button>
              or <Link to="/login">Log in!</Link>
            </Form.Item>
          </Form>
        </Flex>
      </Layout.Content>
    </Layout>
  );
}

export default SignUp;
