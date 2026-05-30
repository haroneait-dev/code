import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { countUnread, listNotifications } from "@/lib/notifications/queries";

export async function GET() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const [items, unread] = await Promise.all([
    listNotifications(user.id),
    countUnread(user.id),
  ]);

  return NextResponse.json({ items, unread });
}
