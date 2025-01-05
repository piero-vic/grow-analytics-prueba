import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  readSessionCookie,
  validateSessionToken,
  deleteSessionTokenCookie,
  setSessionTokenCookie,
} from "./lib/session.js";
import { authRouter } from "./routes/auth.js";
import { usersRouter } from "./routes/users.js";

dotenv.config();

const ALLOWED_ORIGIN = "http://localhost:5173";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CSRF protection
app.use((req, res, next) => {
  if (req.method === "GET") {
    next();
    return;
  }

  const origin = req.headers.origin ?? null;
  if (origin === null || origin != ALLOWED_ORIGIN) {
    res.status(403).end();
    return;
  }

  next();
  return;
});

// Session validation
app.use(async (req, res, next) => {
  const token = readSessionCookie(req.headers.cookie ?? "");
  if (!token) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await validateSessionToken(token);
  if (session === null) {
    deleteSessionTokenCookie(res);
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  setSessionTokenCookie(res, token, session.expiresAt);

  res.locals.session = session;
  res.locals.user = user;

  return next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Grow Analytics");
});

app.use("/auth", authRouter);

// TODO: Agregar middleware para validar autenticación
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
