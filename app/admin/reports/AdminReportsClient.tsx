"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, Flag, Trash2, Clock, ShieldCheck } from "lucide-react";

export type ReportRow = {
  id: string;
  reporter_username: string | null;
  reporter_email: string | null;
  target_kind: "post" | "comment" | "user" | "message";
  target_id: string;
  target_label: string;
  target_href: string | null;
  target_deleted: boolean;
  reason: string;
  status: "pending" | "reviewed" | "dismissed" | "actioned";
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
};

type Filter = "pending" | "reviewed" | "all";

export function AdminReportsClient({ initial }: { initial: ReportRow[] }) {
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<Filter>("pending");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === "pending").length,
      reviewed: rows.filter((r) => r.status !== "pending").length,
      all: rows.length,
    }),
    [rows]
  );

  const visible = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "pending") return rows.filter((r) => r.status === "pending");
    return rows.filter((r) => r.status !== "pending");
  }, [rows, filter]);

  const patch = async (
    id: string,
    body: { status: string; action?: string }
  ) => {
    setPendingId(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error ?? "Échec de l'action");
        return;
      }
      const newStatus = (data.status ?? body.status) as ReportRow["status"];
      startTransition(() => {
        setRows((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: newStatus,
                  reviewed_at: new Date().toISOString(),
                  target_deleted:
                    body.action === "delete_target" ? true : r.target_deleted,
                }
              : r
          )
        );
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      alert(`Action échouée : ${msg}`);
    } finally {
      setPendingId(null);
    }
  };

  const markReviewed = (id: string) => patch(id, { status: "reviewed" });
  const dismiss = (id: string) => patch(id, { status: "dismissed" });
  const deleteTarget = (id: string) => {
    if (!confirm("Supprimer la cible signalée ? Action irréversible.")) return;
    patch(id, { status: "actioned", action: "delete_target" });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        {(["pending", "reviewed", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-body-sm font-medium transition-colors border ${
              filter === f
                ? "bg-on-surface text-inverse-on-surface border-on-surface"
                : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:text-on-surface"
            }`}
          >
            {LABELS[f]} <span className="opacity-60">({counts[f]})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-outline-variant rounded-xl">
          <p className="text-on-surface-variant">
            Aucun signalement dans cette vue.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((r) => (
            <li
              key={r.id}
              className="border border-outline-variant rounded-xl bg-surface-container-lowest p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                  <Flag className="w-4 h-4 text-error" strokeWidth={1.75} />
                  <span className="uppercase tracking-wider text-xs font-semibold text-on-surface-variant">
                    {KIND_LABEL[r.target_kind]}
                  </span>
                  <span>·</span>
                  <span>{formatDate(r.created_at)}</span>
                </div>
                <StatusBadge status={r.status} />
              </div>

              <div className="mb-3">
                <div className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                  Cible
                </div>
                {r.target_href ? (
                  <Link
                    href={r.target_href}
                    target="_blank"
                    className="text-body-rt text-on-surface hover:text-primary transition-colors break-words"
                  >
                    {r.target_label || "(vide)"}
                  </Link>
                ) : (
                  <span className="text-body-rt text-on-surface break-words">
                    {r.target_label || "(vide)"}
                  </span>
                )}
                {r.target_deleted && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-error">
                    <Trash2 className="w-3 h-3" strokeWidth={1.75} />
                    Supprimée
                  </span>
                )}
              </div>

              <div className="mb-3 bg-primary-fixed/40 rounded-xl p-3">
                <div className="text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                  Raison
                </div>
                <p className="text-body-rt text-on-surface whitespace-pre-wrap leading-relaxed">
                  {r.reason}
                </p>
              </div>

              <div className="text-xs text-on-surface-variant mb-3">
                Signalé par{" "}
                {r.reporter_username ? (
                  <Link
                    href={`/u/${r.reporter_username}`}
                    className="text-on-surface hover:text-primary transition-colors"
                  >
                    {r.reporter_username}
                  </Link>
                ) : (
                  <span className="text-on-surface">
                    {r.reporter_email ?? "anonyme"}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {r.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => markReviewed(r.id)}
                    disabled={pendingId === r.id}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary text-on-primary text-body-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
                  >
                    <Check className="w-4 h-4" strokeWidth={2} />
                    Marquer résolu
                  </button>
                )}
                {r.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => dismiss(r.id)}
                    disabled={pendingId === r.id}
                    className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface text-body-sm font-medium transition-colors disabled:opacity-60"
                  >
                    <X className="w-4 h-4" strokeWidth={2} />
                    Rejeter
                  </button>
                )}
                {(r.target_kind === "post" || r.target_kind === "comment") &&
                  !r.target_deleted && (
                    <button
                      type="button"
                      onClick={() => deleteTarget(r.id)}
                      disabled={pendingId === r.id}
                      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg border border-error/40 text-error hover:bg-error/10 text-body-sm font-medium transition-colors disabled:opacity-60"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                      Supprimer cible
                    </button>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const LABELS: Record<Filter, string> = {
  pending: "En attente",
  reviewed: "Traités",
  all: "Tous",
};

const KIND_LABEL: Record<ReportRow["target_kind"], string> = {
  post: "Post",
  comment: "Commentaire",
  user: "Utilisateur",
  message: "Message",
};

function StatusBadge({ status }: { status: ReportRow["status"] }) {
  const map = {
    pending: {
      label: "En attente",
      icon: Clock,
      bg: "rgba(122,117,107,0.15)",
      fg: "#6b6359",
    },
    reviewed: {
      label: "Résolu",
      icon: ShieldCheck,
      bg: "rgba(122,167,122,0.15)",
      fg: "#4a7a4a",
    },
    dismissed: {
      label: "Rejeté",
      icon: X,
      bg: "rgba(122,117,107,0.15)",
      fg: "#6b6359",
    },
    actioned: {
      label: "Sanctionné",
      icon: Trash2,
      bg: "rgba(186,26,26,0.1)",
      fg: "#93000a",
    },
  } as const;
  const { label, icon: Icon, bg, fg } = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider self-start"
      style={{ backgroundColor: bg, color: fg }}
    >
      <Icon className="w-3 h-3" strokeWidth={2} />
      {label}
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
