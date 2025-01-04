import { Router } from "express";
import {
  createSession,
  deleteSessionTokenCookie,
  generateSessionToken,
  invalidateSession,
  setSessionTokenCookie,
} from "../lib/session.js";
import { hash, verify, type Options } from "@node-rs/argon2";
import { z } from "zod";
import { prisma } from "../lib/db.js";

const ARGON2_OPTIONS: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export const authRouter = Router();

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

authRouter.post("/login", async (req, res) => {
  const validationResponse = loginSchema.safeParse(req.body);
  if (!validationResponse.success) {
    res.status(400).end();
    return;
  }

  const { data } = validationResponse;

  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });
  if (!user) {
    res.status(400).end();
    return;
  }

  const validPassword = await verify(
    user.password,
    data.password,
    ARGON2_OPTIONS,
  );
  if (!validPassword) {
    res.status(400).end();
    return;
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  setSessionTokenCookie(res, token, session.expiresAt);

  res.status(200).end();
});

const signupSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
  paternalLastName: z.string(),
  maternalLastName: z.string(),
  password: z.string(),
});

authRouter.post("/signup", async (req, res) => {
  const validationResponse = signupSchema.safeParse(req.body);
  if (!validationResponse.success) {
    res.status(400).end();
    return;
  }

  const { data } = validationResponse;

  const passwordHash = await hash(data.password, ARGON2_OPTIONS);
  try {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        name: data.name,
        paternalLastName: data.paternalLastName,
        maternalLastName: data.maternalLastName,
        password: passwordHash,
      },
    });

    // Setting session
    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionTokenCookie(res, token, session.expiresAt);

    res.status(200).end();
    return;
  } catch (error) {
    // TODO: Agregar flujo para diferentes tipos de errores
    res.status(500).end();
    return;
  }
});

authRouter.post("/logout", async (_, res) => {
  if (!res.locals.session) {
    res.status(401).end();
    return;
  }

  await invalidateSession(res.locals.session.id);
  deleteSessionTokenCookie(res);

  res.status(200).end();
});
