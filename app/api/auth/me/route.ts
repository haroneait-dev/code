import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.step !== "authenticated")
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  return NextResponse.json({ userId: session.userId, email: session.email });
}
