import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { AdminReportsClient, type ReportRow } from "./AdminReportsClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin · Signalements — Claude Mastery",
  robots: { index: false },
};

type RawReport = {
  id: string;
  reporter_id: string;
  target_kind: "post" | "comment" | "user" | "message";
  target_id: string;
  reason: string;
  status: "pending" | "reviewed" | "dismissed" | "actioned";
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export default async function AdminReportsPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/");
  }

  const admin = getServiceSupabase();

  const { data: reportsData, error } = await admin
    .from("community_reports")
    .select(
      "id, reporter_id, target_kind, target_id, reason, status, admin_note, created_at, reviewed_at"
    )
    .order("created_at", { ascending: false })
    .limit(500);

  const reports = (reportsData as RawReport[] | null) ?? [];

  const reporterIds = Array.from(new Set(reports.map((r) => r.reporter_id)));
  const postIds = Array.from(
    new Set(reports.filter((r) => r.target_kind === "post").map((r) => r.target_id))
  );
  const commentIds = Array.from(
    new Set(
      reports.filter((r) => r.target_kind === "comment").map((r) => r.target_id)
    )
  );

  const [reportersRes, postsRes, commentsRes] = await Promise.all([
    reporterIds.length > 0
      ? admin
          .from("profiles")
          .select("user_id, username, email")
          .in("user_id", reporterIds)
      : Promise.resolve({ data: [] as any[] }),
    postIds.length > 0
      ? admin
          .from("community_posts")
          .select("id, slug, title, deleted_at")
          .in("id", postIds)
      : Promise.resolve({ data: [] as any[] }),
    commentIds.length > 0
      ? admin
          .from("community_comments")
          .select("id, post_id, body, deleted_at")
          .in("id", commentIds)
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const reporters = new Map<
    string,
    { username: string | null; email: string | null }
  >();
  for (const row of (reportersRes.data ?? []) as {
    user_id: string;
    username: string | null;
    email: string | null;
  }[]) {
    reporters.set(row.user_id, {
      username: row.username,
      email: row.email,
    });
  }

  const posts = new Map<
    string,
    { slug: string; title: string; deleted_at: string | null }
  >();
  for (const row of (postsRes.data ?? []) as {
    id: string;
    slug: string;
    title: string;
    deleted_at: string | null;
  }[]) {
    posts.set(row.id, {
      slug: row.slug,
      title: row.title,
      deleted_at: row.deleted_at,
    });
  }

  const commentPostIds = Array.from(
    new Set(
      ((commentsRes.data ?? []) as { post_id: string }[]).map((c) => c.post_id)
    )
  );
  const postsForComments = new Map<string, { slug: string; title: string }>();
  if (commentPostIds.length > 0) {
    const { data: cpData } = await admin
      .from("community_posts")
      .select("id, slug, title")
      .in("id", commentPostIds);
    for (const row of (cpData ?? []) as {
      id: string;
      slug: string;
      title: string;
    }[]) {
      postsForComments.set(row.id, { slug: row.slug, title: row.title });
    }
  }

  const comments = new Map<
    string,
    {
      post_id: string;
      body: string;
      deleted_at: string | null;
      post_slug: string | null;
      post_title: string | null;
    }
  >();
  for (const row of (commentsRes.data ?? []) as {
    id: string;
    post_id: string;
    body: string;
    deleted_at: string | null;
  }[]) {
    const parent = postsForComments.get(row.post_id);
    comments.set(row.id, {
      post_id: row.post_id,
      body: row.body,
      deleted_at: row.deleted_at,
      post_slug: parent?.slug ?? null,
      post_title: parent?.title ?? null,
    });
  }

  const rows: ReportRow[] = reports.map((r) => {
    const reporter = reporters.get(r.reporter_id);
    let targetLabel = "Cible inconnue";
    let targetHref: string | null = null;
    let targetDeleted = false;

    if (r.target_kind === "post") {
      const p = posts.get(r.target_id);
      if (p) {
        targetLabel = p.title;
        targetHref = `/communaute/${p.slug}`;
        targetDeleted = !!p.deleted_at;
      }
    } else if (r.target_kind === "comment") {
      const c = comments.get(r.target_id);
      if (c) {
        targetLabel = c.body.slice(0, 140);
        targetHref = c.post_slug ? `/communaute/${c.post_slug}` : null;
        targetDeleted = !!c.deleted_at;
      }
    } else {
      targetLabel = `${r.target_kind} ${r.target_id.slice(0, 8)}`;
    }

    return {
      id: r.id,
      reporter_username: reporter?.username ?? null,
      reporter_email: reporter?.email ?? null,
      target_kind: r.target_kind,
      target_id: r.target_id,
      target_label: targetLabel,
      target_href: targetHref,
      target_deleted: targetDeleted,
      reason: r.reason,
      status: r.status,
      admin_note: r.admin_note,
      created_at: r.created_at,
      reviewed_at: r.reviewed_at,
    };
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <header className="mb-10">
          <div className="inline-flex items-center border border-outline-variant rounded-full px-4 py-1 mb-4">
            <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
              Administration
            </span>
          </div>
          <h1 className="font-display-xl text-[40px] md:text-[48px] font-extrabold tracking-tight text-on-surface mb-3">
            Signalements
          </h1>
          <p className="font-body-rt text-body-rt text-on-surface-variant">
            Examine les contenus signalés par la communauté et applique les
            sanctions.
          </p>
        </header>

        {error && (
          <p className="text-sm text-error mb-4">
            Erreur de chargement : {error.message}
          </p>
        )}

        <AdminReportsClient initial={rows} />
      </main>

      <SiteFooter />
    </div>
  );
}
