import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { getSession, signToken, cookieOptions } from "@/lib/session";
import { getUserById, updateUser } from "@/lib/users";

// GET — génère ou récupère le secret TOTP et retourne le QR code
export async function GET() {
  const session = await getSession();
  if (!session || session.step !== "setup_2fa")
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const user = getUserById(session.userId);
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  // Générer un nouveau secret si l'utilisateur n'en a pas encore
  const secret = user.totpSecret ?? authenticator.generateSecret();
  if (!user.totpSecret) updateUser(user.id, { totpSecret: secret });

  const otpauth = authenticator.keyuri(user.email, "Claude Code Formation", secret);
  const qrDataURL = await QRCode.toDataURL(otpauth, { width: 200, margin: 2 });

  return NextResponse.json({ secret, qrDataURL });
}

// POST — vérifie le code et active le 2FA
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.step !== "setup_2fa")
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

  const user = getUserById(session.userId);
  if (!user || !user.totpSecret)
    return NextResponse.json({ error: "Secret 2FA introuvable" }, { status: 400 });

  const isValid = authenticator.verify({ token: code.replace(/\s/g, ""), secret: user.totpSecret });
  if (!isValid)
    return NextResponse.json({ error: "Code incorrect, réessayez" }, { status: 400 });

  updateUser(user.id, { totpEnabled: true });

  const newToken = await signToken({ userId: user.id, email: user.email, step: "authenticated" });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", newToken, cookieOptions());
  return res;
}
