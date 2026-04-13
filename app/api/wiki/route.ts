import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("wiki_tips")
    .select("*")
    .order("upvotes", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  const body = await req.json();
  const { title, content, author, category } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Titre et contenu requis." }, { status: 400 });
  }

  const { data, error } = await (supabase
    .from("wiki_tips") as any)
    .insert({
      title: title.trim(),
      content: content.trim(),
      author: author?.trim() || null,
      category: category || "Divers",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
