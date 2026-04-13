import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/lib/users";
import { signToken, cookieOptions } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email))
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json(
        { error: "Mot de passe trop court (8 caractères minimum)" },
        { status: 400 }
      );

    if (getUserByEmail(email))
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = createUser(email, passwordHash);

    const token = await signToken({ userId: user.id, email: user.email, step: "setup_2fa" });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", token, cookieOptions());
    return res;
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
