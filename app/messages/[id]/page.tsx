import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Avatar } from "@/components/site/Avatar";
import { getServerSupabase } from "@/lib/supabase-server";
import { MessageThread } from "@/components/messages/MessageThread";
import type { DirectMessage, PublicProfile } from "@/lib/community/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

type Author = Pick<
  PublicProfile,
  "user_id" | "username" | "display_name" | "avatar_url"
>;

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    title: "Conversation",
    description: `Conversation privée ${id.slice(0, 8)}…`,
  };
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/?login=1&from=/messages/${id}`);

  // RLS: only participants can read the row
  const { data: myParticipation } = await supabase
    .from("conversation_participants")
    .select("conversation_id, last_read_at")
    .eq("conversation_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!myParticipation) notFound();

  const [{ data: otherPart }, { data: messages }] = await Promise.all([
    supabase
      .from("conversation_participants")
      .select("user_id")
      .eq("conversation_id", id)
      .neq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, created_at, deleted_at")
      .eq("conversation_id", id)
      .is("deleted_at", null)
      .order("created_at", { ascending: true })
      .limit(500),
  ]);

  let otherUser: Author | null = null;
  const otherId = (otherPart as { user_id: string } | null)?.user_id ?? null;
  if (otherId) {
    const { data: profile } = await supabase
      .from("community_profiles")
      .select("user_id, username, display_name, avatar_url")
      .eq("user_id", otherId)
      .maybeSingle();
    otherUser = (profile as Author | null) ?? null;
  }

  const initialMessages = (messages as DirectMessage[] | null) ?? [];

  return (
    <div className="h-screen flex flex-col">
      <SiteHeader />

      <div className="border-b border-outline-variant bg-surface">
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-3 flex items-center gap-3">
          <Link
            href="/messages"
            className="text-on-surface-variant hover:text-on-surface transition-colors shrink-0"
            aria-label="Retour aux messages"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          </Link>
          <Avatar
            name={otherUser?.display_name ?? otherUser?.username ?? "?"}
            initial={(otherUser?.username?.[0] ?? "?").toUpperCase()}
            size={40}
          />
          <div className="min-w-0 flex-1">
            {otherUser?.username ? (
              <Link
                href={`/u/${otherUser.username}`}
                className="block text-body-rt font-medium text-on-surface hover:text-primary transition-colors truncate"
              >
                {otherUser.display_name ?? otherUser.username}
              </Link>
            ) : (
              <span className="block text-body-rt font-medium text-on-surface truncate">
                Utilisateur inconnu
              </span>
            )}
            {otherUser?.username && (
              <span className="block text-xs text-on-surface-variant truncate">
                @{otherUser.username}
              </span>
            )}
          </div>
        </div>
      </div>

      <MessageThread
        conversationId={id}
        currentUserId={user.id}
        otherUser={otherUser}
        initialMessages={initialMessages}
      />
    </div>
  );
}
