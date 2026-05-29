"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Reply, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/site/Avatar";
import type { CommentWithAuthor } from "@/lib/community/queries";

type Node = CommentWithAuthor & { children: Node[] };

function buildTree(flat: CommentWithAuthor[]): Node[] {
  const byId = new Map<string, Node>();
  for (const c of flat) {
    byId.set(c.id, { ...c, children: [] });
  }
  const roots: Node[] = [];
  for (const c of flat) {
    const node = byId.get(c.id)!;
    if (c.parent_id && byId.has(c.parent_id)) {
      byId.get(c.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function CommentTree({
  postId,
  comments,
  canPost,
}: {
  postId: string;
  comments: CommentWithAuthor[];
  canPost: boolean;
}) {
  const tree = useMemo(() => buildTree(comments), [comments]);
  return (
    <ul className="flex flex-col gap-5">
      {tree.length === 0 && (
        <li className="text-body-sm text-on-surface-variant italic">
          Aucun commentaire pour l'instant.
        </li>
      )}
      {tree.map((n) => (
        <CommentItem
          key={n.id}
          node={n}
          postId={postId}
          depth={0}
          canPost={canPost}
        />
      ))}
    </ul>
  );
}

function CommentItem({
  node,
  postId,
  depth,
  canPost,
}: {
  node: Node;
  postId: string;
  depth: number;
  canPost: boolean;
}) {
  const [replyOpen, setReplyOpen] = useState(false);

  const indent = Math.min(depth, 5) * 16;
  return (
    <li>
      <div
        className="border-l border-outline-variant pl-4 py-1"
        style={{ marginLeft: indent }}
      >
        <div className="flex items-center gap-2 mb-2 text-body-sm text-on-surface-variant min-w-0">
          <Avatar
            name={node.author?.display_name ?? node.author?.username ?? "?"}
            initial={(node.author?.username?.[0] ?? "?").toUpperCase()}
            size={24}
          />
          {node.author?.username ? (
            <Link
              href={`/u/${node.author.username}`}
              className="text-on-surface font-medium hover:text-primary transition-colors truncate"
            >
              {node.author.display_name ?? node.author.username}
            </Link>
          ) : (
            <span className="text-on-surface font-medium truncate">
              Anonyme
            </span>
          )}
          <span>·</span>
          <span>{relativeTime(node.created_at)}</span>
          <span>·</span>
          <span>{node.score} pts</span>
        </div>
        <div className="text-body-rt text-on-surface whitespace-pre-wrap mb-2 leading-relaxed">
          {node.body}
        </div>
        {canPost && (
          <button
            type="button"
            onClick={() => setReplyOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            <Reply className="w-3.5 h-3.5" strokeWidth={1.75} />
            Répondre
          </button>
        )}
        {replyOpen && (
          <div className="mt-3">
            <ReplyForm
              postId={postId}
              parentId={node.id}
              onCancel={() => setReplyOpen(false)}
            />
          </div>
        )}
      </div>
      {node.children.length > 0 && (
        <ul className="flex flex-col gap-5 mt-4">
          {node.children.map((child) => (
            <CommentItem
              key={child.id}
              node={child}
              postId={postId}
              depth={depth + 1}
              canPost={canPost}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function ReplyForm({
  postId,
  parentId = null,
  onCancel,
}: {
  postId: string;
  parentId?: string | null;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, parent_id: parentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur inconnue");
        return;
      }
      setBody("");
      router.refresh();
      onCancel?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={parentId ? "Réponds…" : "Ton commentaire…"}
        className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-rt text-on-surface outline-none focus:border-primary transition-colors resize-y"
        maxLength={10000}
      />
      {error && (
        <div className="text-body-sm text-error">{error}</div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading || body.trim().length === 0}
          className="btn-primary px-5 h-9 rounded-full inline-flex items-center gap-2 text-body-sm font-medium disabled:opacity-50"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
          {loading ? "Envoi…" : parentId ? "Répondre" : "Commenter"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
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
  });
}
