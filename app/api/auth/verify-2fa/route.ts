import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import { getSession, signToken, cookieOptions } from "@/lib/session";
import { getUserById } from "@/lib/users";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.step !== "needs_2fa")
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

  const user = getUserById(session.userId);
  if (!user || !user.totpSecret || !user.totpEnabled)
    return NextResponse.json({ error: "2FA non configuré" }, { status: 400 });

  const isValid = authenticator.verify({ token: code.replace(/\s/g, ""), secret: user.totpSecret });
  if (!isValid)
    return NextResponse.json({ error: "Code incorrect, réessayez" }, { status: 400 });

  const newToken = await signToken({ userId: user.id, email: user.email, step: "authenticated" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", newToken, cookieOptions());
  return res;
}
