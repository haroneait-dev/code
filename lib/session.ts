import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-secret-claude-code-formation-change-in-prod"
);

export type SessionStep = "setup_2fa" | "needs_2fa" | "authenticated";

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  step: SessionStep;
}

export async function signToken(
  payload: Omit<SessionPayload, keyof JWTPayload>
): Promise<string> {
  return new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as SessionPayload;
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const store = await cookies();
    const token = store.get("session")?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function cookieOptions(maxAge = 7 * 24 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
