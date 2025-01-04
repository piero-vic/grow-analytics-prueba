import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "antd/dist/reset.css";
import App from "./App.tsx";
import Login from "./routes/Login.tsx";
import SignUp from "./routes/SignUp.tsx";
import { AuthProvider, RequireAuth, RequireUnauth } from "./lib/auth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <App />
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
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
