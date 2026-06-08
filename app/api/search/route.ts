import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

// Suggestions de recherche (formation + wiki). Contenu statique → pas d'auth,
// in-memory, ultra rapide. On limite à 8 suggestions pour le menu déroulant.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const results = searchSite(q, 8);

  return NextResponse.json(
    { results },
    {
      headers: {
        // cache court côté CDN : la donnée ne change qu'à chaque déploiement
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    },
  );
}
