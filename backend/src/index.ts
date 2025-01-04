import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import {
  readSessionCookie,
  validateSessionToken,
  deleteSessionTokenCookie,
  setSessionTokenCookie,
} from "./lib/session";

dotenv.config();

const ALLOWED_ORIGIN = "http://localhost:3000";

const app: Express = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});
