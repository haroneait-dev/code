import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { markRead } from "@/lib/notifications/queries";

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let ids: string[] | undefined;
  try {
    const payload = (await req.json()) as { ids?: unknown };
    if (Array.isArray(payload.ids)) {
      ids = payload.ids.filter((v): v is string => typeof v === "string");
    }
  } catch {
    ids = undefined;
  }

  const updated = await markRead(user.id, ids);
  return NextResponse.json({ updated });
}
