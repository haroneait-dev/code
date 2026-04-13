import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/users";
import { signToken, cookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });

    const user = getUserByEmail(email);
    if (!user)
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

    // If 2FA not set up yet, redirect to setup
    if (!user.totpEnabled) {
      const token = await signToken({ userId: user.id, email: user.email, step: "setup_2fa" });
      const res = NextResponse.json({ ok: true, step: "setup_2fa" });
      res.cookies.set("session", token, cookieOptions());
      return res;
    }

    // 2FA required
    const token = await signToken({ userId: user.id, email: user.email, step: "needs_2fa" });
    const res = NextResponse.json({ ok: true, step: "needs_2fa" });
    res.cookies.set("session", token, cookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
