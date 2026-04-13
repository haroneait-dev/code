import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();

  const { data: skill, error: fetchError } = await supabase
    .from("community_skills")
    .select("upvotes")
    .eq("id", id)
    .single();

  if (fetchError || !skill) {
    return NextResponse.json({ error: "Compétence introuvable." }, { status: 404 });
  }

  const { error } = await (supabase
    .from("community_skills") as any)
    .update({ upvotes: (skill as { upvotes: number }).upvotes + 1 })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
