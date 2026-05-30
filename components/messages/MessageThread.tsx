"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { MessageComposer } from "@/components/messages/MessageComposer";
import type { DirectMessage, PublicProfile } from "@/lib/community/types";

type Author = Pick<
  PublicProfile,
  "user_id" | "username" | "display_name" | "avatar_url"
>;

type LocalMessage = DirectMessage & { _optimistic?: boolean };

export function MessageThread({
  conversationId,
  currentUserId,
  otherUser,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  otherUser: Author | null;
  initialMessages: DirectMessage[];
}) {
  const [messages, setMessages] = useState<LocalMessage[]>(initialMessages);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const readTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    [messages]
  );

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [sortedMessages.length]);

  // Debounced "mark as read" call
  const scheduleMarkRead = () => {
    if (readTimerRef.current) clearTimeout(readTimerRef.current);
    readTimerRef.current = setTimeout(() => {
      void fetch("/api/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: conversationId }),
      }).catch(() => {});
    }, 500);
  };

  // Mark read on mount
  useEffect(() => {
    scheduleMarkRead();
    return () => {
      if (readTimerRef.current) clearTimeout(readTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Realtime subscription
  useEffect(() => {
    const supabase = getSupabase();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming = payload.new as DirectMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            // Reconcile optimistic message: drop temp from same sender with same body
            const next = prev.filter(
              (m) =>
                !(
                  m._optimistic &&
                  m.sender_id === incoming.sender_id &&
                  m.body === incoming.body
                )
            );
            return [...next, incoming];
          });
          scheduleMarkRead();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleOptimistic = (tempId: string, body: string) => {
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversation_id: conversationId,
        sender_id: currentUserId,
        body,
        created_at: now,
        deleted_at: null,
        _optimistic: true,
      },
    ]);
  };

  const handleSent = (tempId: string, realId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === tempId ? { ...m, id: realId, _optimistic: false } : m
      )
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-margin-mobile md:px-margin-desktop py-6"
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {sortedMessages.length === 0 ? (
            <div className="text-center text-body-sm text-on-surface-variant py-12">
              Lance la conversation — envoie ton premier message.
            </div>
          ) : (
            sortedMessages.map((m, i) => {
              const mine = m.sender_id === currentUserId;
              const prev = sortedMessages[i - 1];
              const sameSenderAsPrev = prev && prev.sender_id === m.sender_id;
              return (
                <MessageBubble
                  key={m.id}
                  body={m.body}
                  createdAt={m.created_at}
                  mine={mine}
                  author={mine ? null : otherUser}
                  showAvatar={!mine && !sameSenderAsPrev}
                />
              );
            })
          )}
        </div>
      </div>

      <MessageComposer
        conversationId={conversationId}
        onOptimistic={handleOptimistic}
        onSent={handleSent}
      />
    </div>
  );
}
