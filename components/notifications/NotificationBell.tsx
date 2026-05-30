"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { Avatar } from "@/components/site/Avatar";
import type {
  NotificationKind,
  NotificationRow,
} from "@/lib/notifications/queries";

interface ApiResponse {
  items: NotificationRow[];
  unread: number;
}

const POLL_MS = 60_000;

export function NotificationBell() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fetchedOnce = useRef(false);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as ApiResponse;
      setItems(data.items ?? []);
      setUnread(data.unread ?? 0);
      fetchedOnce.current = true;
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      setItems([]);
      setUnread(0);
      return;
    }
    refresh();
    const id = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(id);
  }, [session, refresh]);

  useEffect(() => {
    if (open && !fetchedOnce.current) refresh();
  }, [open, refresh]);

  const markAllRead = async () => {
    if (unread === 0) return;
    await fetch("/api/notifications/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    setItems((prev) =>
      prev.map((n) =>
        n.read_at ? n : { ...n, read_at: new Date().toISOString() }
      )
    );
    setUnread(0);
  };

  const handleClickItem = async (n: NotificationRow) => {
    setOpen(false);
    if (!n.read_at) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === n.id ? { ...it, read_at: new Date().toISOString() } : it
        )
      );
      setUnread((c) => Math.max(0, c - 1));
      fetch("/api/notifications/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [n.id] }),
      }).catch(() => {});
    }
    const href = targetHref(n);
    if (href) router.push(href);
  };

  if (!session) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-container transition-colors"
        aria-label="Notifications"
      >
        <Bell
          className="w-5 h-5 text-on-surface-variant"
          strokeWidth={1.75}
        />
        {unread > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center"
            aria-label={`${unread} non lues`}
          >
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-12 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
              <div className="text-body-sm font-medium text-on-surface">
                Notifications
              </div>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unread === 0}
                className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                Tout marquer lu
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {loading && items.length === 0 ? (
                <div className="px-4 py-8 text-center text-body-sm text-on-surface-variant">
                  Chargement…
                </div>
              ) : items.length === 0 ? (
                <div className="px-4 py-10 flex flex-col items-center gap-2 text-on-surface-variant">
                  <Inbox className="w-8 h-8" strokeWidth={1.5} />
                  <div className="text-body-sm">Aucune notification</div>
                </div>
              ) : (
                <ul>
                  {items.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => handleClickItem(n)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-container transition-colors border-b border-outline-variant last:border-b-0 ${
                          n.read_at ? "" : "bg-primary-fixed/40"
                        }`}
                      >
                        <NotificationAvatar actor={n.actor} />
                        <div className="flex-1 min-w-0">
                          <div className="text-body-sm text-on-surface">
                            {renderLabel(n)}
                          </div>
                          {n.body_preview && (
                            <div className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                              {n.body_preview}
                            </div>
                          )}
                          <div className="text-xs text-on-surface-variant mt-1">
                            {relativeTime(n.created_at)}
                          </div>
                        </div>
                        {!n.read_at && (
                          <span
                            className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0"
                            aria-hidden
                          />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationAvatar({ actor }: { actor: NotificationRow["actor"] }) {
  const name = actor?.display_name ?? actor?.username ?? "?";
  const initial = (name[0] ?? "?").toUpperCase();
  return <Avatar name={name} initial={initial} size={36} />;
}

function actorHandle(actor: NotificationRow["actor"]): string {
  if (!actor) return "Quelqu'un";
  if (actor.username) return `@${actor.username}`;
  return actor.display_name ?? "Quelqu'un";
}

function renderLabel(n: NotificationRow): string {
  const who = actorHandle(n.actor);
  switch (n.kind as NotificationKind) {
    case "comment_reply":
      return `${who} a répondu à ton commentaire`;
    case "post_reply":
      return n.post
        ? `${who} a commenté ton post "${n.post.title}"`
        : `${who} a commenté ton post`;
    case "dm":
      return `Nouveau message de ${who}`;
    case "mention":
      return `${who} t'a mentionné`;
    default:
      return who;
  }
}

function targetHref(n: NotificationRow): string | null {
  if (n.kind === "dm" && n.conversation_id) {
    return `/messages/${n.conversation_id}`;
  }
  if (n.post?.slug) {
    return n.comment_id
      ? `/communaute/${n.post.slug}#comment-${n.comment_id}`
      : `/communaute/${n.post.slug}`;
  }
  if (n.actor?.username) return `/u/${n.actor.username}`;
  return null;
}

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `il y a ${d} j`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}
