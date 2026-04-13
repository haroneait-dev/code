import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("community_skills")
    .select("*")
    .order("upvotes", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  const body = await req.json();
  const { name, level, description, author } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Nom de compétence requis." }, { status: 400 });
  }
  if (!["Débutant", "Intermédiaire", "Avancé"].includes(level)) {
    return NextResponse.json({ error: "Niveau invalide." }, { status: 400 });
  }

  const { data, error } = await (supabase
    .from("community_skills") as any)
    .insert({
      name: name.trim(),
      level,
      description: description?.trim() || null,
      author: author?.trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
