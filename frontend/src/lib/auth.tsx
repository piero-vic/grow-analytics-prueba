import * as React from "react";
import { useLocation, Navigate } from "react-router";

type Credentials = { email: string; password: string };

type UserData = {
  username: string;
  email: string;
  name: string;
  paternalLastName: string;
  maternalLastName: string;
  password: string;
};

type Auth = {
  authed: boolean;
  login: (credentials: Credentials) => Promise<void>;
  signup: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
};

const authContext = React.createContext<Auth>({
  authed: false,
  login: async (credentials: Credentials) => { },
  signup: async (userData: Credentials) => { },
  logout: async () => { },
});

export function useAuth() {
  return React.useContext(authContext);
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}> {children} </authContext.Provider>;
};

function useProvideAuth() {
  const [authed, setAuthed] = React.useState(false);

  // TODO: Agregar manejo de errores
  React.useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      credentials: "include",
      headers: new Headers({ "content-type": "application/json" }),
    }).then((res) => {
      if (res.ok) {
        setAuthed(true);
      } else {
        setAuthed(false);
      }
    });
  }, []);

  return {
    authed,
    async login(credentials: Credentials) {
      const respose = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify(credentials),
      });

      if (respose.ok) {
        setAuthed(true);
      }
    },
    async signup(userData: UserData) {
      const respose = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify(userData),
      });

      if (respose.ok) {
        setAuthed(true);
      }
    },
    async logout() {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuthed(false);
    },
  };
}

export const RequireAuth: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

export const RequireUnauth: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { authed } = useAuth();
  const location = useLocation();

  return authed !== true ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }} />
  );
};
