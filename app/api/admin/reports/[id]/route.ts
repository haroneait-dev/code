import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";

const VALID_STATUS = new Set(["pending", "reviewed", "dismissed", "actioned"]);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await getServerSupabase();
  const {
    data: { user: caller },
  } = await supabase.auth.getUser();

  if (!caller || !isAdminEmail(caller.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload: { status?: string; admin_note?: string; action?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const status = (payload.status ?? "").trim();
  if (!VALID_STATUS.has(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const adminNote =
    typeof payload.admin_note === "string" && payload.admin_note.trim().length > 0
      ? payload.admin_note.trim().slice(0, 2000)
      : null;
  const action = payload.action;

  const admin = getServiceSupabase();

  const { data: report } = await admin
    .from("community_reports")
    .select("id, target_kind, target_id, status")
    .eq("id", id)
    .maybeSingle();

  const r = report as
    | { id: string; target_kind: string; target_id: string; status: string }
    | null;
  if (!r) {
    return NextResponse.json(
      { error: "Signalement introuvable." },
      { status: 404 }
    );
  }

  let finalStatus = status;
  if (action === "delete_target") {
    if (r.target_kind === "post") {
      const { error: e1 } = await admin
        .from("community_posts")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", r.target_id);
      if (e1) {
        return NextResponse.json({ error: e1.message }, { status: 500 });
      }
    } else if (r.target_kind === "comment") {
      const { error: e2 } = await admin
        .from("community_comments")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", r.target_id);
      if (e2) {
        return NextResponse.json({ error: e2.message }, { status: 500 });
      }
    } else {
      return NextResponse.json(
        { error: "Action de suppression non supportée pour ce type." },
        { status: 400 }
      );
    }
    finalStatus = "actioned";
  }

  const { error } = await (admin.from("community_reports") as any)
    .update({
      status: finalStatus,
      reviewed_by: caller.id,
      reviewed_at: new Date().toISOString(),
      admin_note: adminNote,
    })
    .eq("id", r.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: finalStatus });
}
