import type { Session } from "@prisma/client";
import type { Response } from "express";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { prisma } from "./db.js";
import { sha256 } from "@oslojs/crypto/sha2";

const PROD = "production";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: number,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await prisma.session.create({
    data: session,
  });
  return session;
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          userType: true,
          name: true,
          paternalLastName: true,
          maternalLastName: true,
        },
      },
    },
  });
  if (result === null) {
    return { session: null, user: null };
  }
  const { user, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export function setSessionTokenCookie(
  res: Response,
  token: string,
  expiresAt: Date,
): void {
  if (process.env.NODE_ENV === PROD) {
    res.appendHeader(
      "Set-Cookie",
      `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/; Secure;`,
    );
  } else {
    res.appendHeader(
      "Set-Cookie",
      `session=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/`,
    );
  }
}

export function deleteSessionTokenCookie(res: Response): void {
  if (process.env.NODE_ENV === PROD) {
    res.appendHeader(
      "Set-Cookie",
      "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/; Secure;",
    );
  } else {
    res.appendHeader(
      "Set-Cookie",
      "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/",
    );
  }
}

export function readSessionCookie(cookieHeader: string): string | null {
  const cookies = new Map<string, string>();
  const items = cookieHeader.split("; ");

  for (const item of items) {
    const pair = item.split("=");
    const rawKey = pair[0];
    const rawValue = pair[1] ?? "";
    if (!rawKey) continue;
    cookies.set(decodeURIComponent(rawKey), decodeURIComponent(rawValue));
  }

  return cookies.get("session") ?? null;
}

type User = {
  id: number;
  email: string;
};

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
