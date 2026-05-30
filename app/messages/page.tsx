import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { getServerSupabase } from "@/lib/supabase-server";
import {
  ConversationList,
  type ConversationListItem,
} from "@/components/messages/ConversationList";
import type { PublicProfile } from "@/lib/community/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages privés",
  description: "Tes conversations privées sur Claude Mastery.",
};

type Author = Pick<
  PublicProfile,
  "user_id" | "username" | "display_name" | "avatar_url"
>;

export default async function MessagesInboxPage() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?login=1&from=/messages");

  // Conversations I belong to + my last_read_at
  const { data: myParticipations } = await supabase
    .from("conversation_participants")
    .select("conversation_id, last_read_at")
    .eq("user_id", user.id);

  const myRows =
    (myParticipations as { conversation_id: string; last_read_at: string }[] | null) ??
    [];
  const convIds = myRows.map((r) => r.conversation_id);
  const lastReadByConv = new Map(
    myRows.map((r) => [r.conversation_id, r.last_read_at])
  );

  let items: ConversationListItem[] = [];

  if (convIds.length > 0) {
    const [{ data: convs }, { data: otherParts }, { data: lastMessages }] =
      await Promise.all([
        supabase
          .from("conversations")
          .select("id, created_at, last_message_at")
          .in("id", convIds)
          .order("last_message_at", { ascending: false }),
        supabase
          .from("conversation_participants")
          .select("conversation_id, user_id")
          .in("conversation_id", convIds)
          .neq("user_id", user.id),
        supabase
          .from("messages")
          .select("id, conversation_id, sender_id, body, created_at")
          .in("conversation_id", convIds)
          .is("deleted_at", null)
          .order("created_at", { ascending: false }),
      ]);

    const otherUserByConv = new Map<string, string>();
    for (const row of (otherParts as
      | { conversation_id: string; user_id: string }[]
      | null) ?? []) {
      if (!otherUserByConv.has(row.conversation_id)) {
        otherUserByConv.set(row.conversation_id, row.user_id);
      }
    }

    const otherUserIds = Array.from(new Set(otherUserByConv.values()));
    const authorMap = new Map<string, Author>();
    if (otherUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("community_profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", otherUserIds);
      for (const a of (profiles as Author[] | null) ?? []) {
        authorMap.set(a.user_id, a);
      }
    }

    const lastMsgByConv = new Map<
      string,
      { sender_id: string; body: string; created_at: string }
    >();
    for (const m of (lastMessages as
      | {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        }[]
      | null) ?? []) {
      if (!lastMsgByConv.has(m.conversation_id)) {
        lastMsgByConv.set(m.conversation_id, {
          sender_id: m.sender_id,
          body: m.body,
          created_at: m.created_at,
        });
      }
    }

    items = (
      (convs as
        | { id: string; created_at: string; last_message_at: string }[]
        | null) ?? []
    ).map((c) => {
      const otherId = otherUserByConv.get(c.id) ?? null;
      const other = otherId ? authorMap.get(otherId) ?? null : null;
      const lastMessage = lastMsgByConv.get(c.id) ?? null;
      const myLastRead = lastReadByConv.get(c.id);
      const unread =
        !!lastMessage &&
        lastMessage.sender_id !== user.id &&
        (!myLastRead ||
          new Date(lastMessage.created_at).getTime() >
            new Date(myLastRead).getTime());
      return {
        conversation_id: c.id,
        last_message_at: c.last_message_at,
        last_read_at: myLastRead ?? c.created_at,
        other_user: other,
        last_message: lastMessage,
        unread,
      };
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-14">
        <header className="mb-8">
          <h1 className="font-display-xl text-[28px] md:text-[36px] font-bold tracking-tight text-on-surface mb-2">
            Messages privés
          </h1>
          <p className="text-body-rt text-on-surface-variant">
            Tes conversations 1-on-1 avec d'autres membres.
          </p>
        </header>

        {items.length > 0 ? (
          <ConversationList items={items} currentUserId={user.id} />
        ) : (
          <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-10 text-center">
            <MessageSquare
              className="w-10 h-10 text-on-surface-variant mx-auto mb-4"
              strokeWidth={1.5}
            />
            <h2 className="text-body-rt font-semibold text-on-surface mb-2">
              Aucune conversation pour l'instant
            </h2>
            <p className="text-body-sm text-on-surface-variant mb-5 max-w-md mx-auto">
              Ouvre le profil d'un membre depuis la{" "}
              <Link
                href="/communaute"
                className="text-primary hover:underline"
              >
                communauté
              </Link>{" "}
              et clique sur "Message privé" pour démarrer un échange.
            </p>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
