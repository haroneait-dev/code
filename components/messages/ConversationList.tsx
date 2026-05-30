import Link from "next/link";
import { Avatar } from "@/components/site/Avatar";
import type { PublicProfile } from "@/lib/community/types";

type Author = Pick<
  PublicProfile,
  "user_id" | "username" | "display_name" | "avatar_url"
>;

export interface ConversationListItem {
  conversation_id: string;
  last_message_at: string;
  last_read_at: string;
  other_user: Author | null;
  last_message: {
    body: string;
    sender_id: string;
    created_at: string;
  } | null;
  unread: boolean;
}

export function ConversationList({
  items,
  currentUserId,
}: {
  items: ConversationListItem[];
  currentUserId: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
        const other = item.other_user;
        const preview = item.last_message;
        const isMine = preview?.sender_id === currentUserId;
        const previewText = preview
          ? `${isMine ? "Toi : " : ""}${preview.body}`
          : "Conversation vide";
        return (
          <li key={item.conversation_id}>
            <Link
              href={`/messages/${item.conversation_id}`}
              className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 hover:border-primary transition-colors"
            >
              <Avatar
                name={other?.display_name ?? other?.username ?? "?"}
                initial={(other?.username?.[0] ?? "?").toUpperCase()}
                size={48}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span
                    className={`text-body-rt truncate ${
                      item.unread
                        ? "font-semibold text-on-surface"
                        : "font-medium text-on-surface"
                    }`}
                  >
                    {other?.display_name ?? other?.username ?? "Utilisateur"}
                  </span>
                  {other?.username && (
                    <span className="text-xs text-on-surface-variant truncate">
                      @{other.username}
                    </span>
                  )}
                </div>
                <p
                  className={`text-body-sm truncate ${
                    item.unread
                      ? "text-on-surface"
                      : "text-on-surface-variant"
                  }`}
                >
                  {previewText}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-xs text-on-surface-variant">
                  {relativeTime(item.last_message_at)}
                </span>
                {item.unread && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-primary"
                    aria-label="Non lu"
                  />
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
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
    year: "numeric",
  });
}
