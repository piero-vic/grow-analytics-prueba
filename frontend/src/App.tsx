import { Button, Layout, Menu } from "antd";
import { Routes, Route, Link } from "react-router";
import { RequireAuth, RequireUnauth, useAuth } from "./lib/auth.tsx";
import UsersTable from "./routes/UsersTable.tsx";
import UsersEditTable from "./routes/UsersEditTable.tsx";
import Login from "./routes/Login.tsx";
import SignUp from "./routes/SignUp.tsx";

function App() {
  const { authed, logout } = useAuth();

  const navItems = [
    { key: 1, label: <Link to="/">Usuarios</Link> },
    { key: 2, label: <Link to="/admin">Admin</Link> },
  ];

  if (authed) {
    navItems.push({
      key: 3,
      label: (
        <Button variant="solid" color="danger" onClick={() => logout()}>
          Logout
        </Button>
      ),
    });
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={navItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Layout.Header>

      <Layout.Content
        style={{ margin: "24px 16px", display: "flex", alignItems: "center" }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <UsersTable />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/"
            element={
              <RequireAuth>
                <UsersEditTable />
              </RequireAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RequireUnauth>
                <Login />
              </RequireUnauth>
            }
          />
          <Route
            path="/signup"
            element={
              <RequireUnauth>
                <SignUp />
              </RequireUnauth>
            }
          />
        </Routes>
      </Layout.Content>
    </Layout>
  );
}

export default App;
