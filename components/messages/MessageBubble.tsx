import Link from "next/link";
import { Avatar } from "@/components/site/Avatar";
import type { PublicProfile } from "@/lib/community/types";

type Author = Pick<
  PublicProfile,
  "user_id" | "username" | "display_name" | "avatar_url"
>;

export function MessageBubble({
  body,
  createdAt,
  mine,
  author,
  showAvatar = true,
}: {
  body: string;
  createdAt: string;
  mine: boolean;
  author: Author | null;
  showAvatar?: boolean;
}) {
  const time = new Date(createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (mine) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] sm:max-w-[70%] flex flex-col items-end gap-1">
          <div className="bg-primary text-on-primary rounded-2xl rounded-br-md px-4 py-2.5 text-body-rt whitespace-pre-wrap leading-relaxed break-words">
            {body}
          </div>
          <span className="text-xs text-on-surface-variant pr-1">{time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2.5">
      {showAvatar ? (
        <div className="pt-1">
          <Avatar
            name={author?.display_name ?? author?.username ?? "?"}
            initial={(author?.username?.[0] ?? "?").toUpperCase()}
            size={32}
          />
        </div>
      ) : (
        <div style={{ width: 32 }} aria-hidden />
      )}
      <div className="max-w-[80%] sm:max-w-[70%] flex flex-col items-start gap-1">
        {showAvatar && author?.username && (
          <Link
            href={`/u/${author.username}`}
            className="text-xs text-on-surface-variant hover:text-primary transition-colors pl-1"
          >
            {author.display_name ?? `@${author.username}`}
          </Link>
        )}
        <div className="bg-surface-container border border-outline-variant rounded-2xl rounded-bl-md px-4 py-2.5 text-body-rt text-on-surface whitespace-pre-wrap leading-relaxed break-words">
          {body}
        </div>
        <span className="text-xs text-on-surface-variant pl-1">{time}</span>
      </div>
    </div>
  );
}
