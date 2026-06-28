// TypeScript types that mirror the Reddit-style community schema
// (supabase/migrations/0003_community_reddit.sql)

export type ProfileStatus = "pending" | "approved" | "rejected";

export interface Profile {
  user_id: string;
  email: string;
  status: ProfileStatus;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  points_post: number;
  points_comment: number;
  onboarded: boolean;
  created_at: string;
}

// Public-facing view (no email / status)
export interface PublicProfile {
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  points_post: number;
  points_comment: number;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  slug: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  score: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CommunityPostWithAuthor extends CommunityPost {
  author: PublicProfile | null;
}

export interface CommunityComment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  body: string;
  score: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CommunityCommentWithAuthor extends CommunityComment {
  author: PublicProfile | null;
}

export type VoteTargetKind = "post" | "comment";

export interface CommunityVote {
  voter_id: string;
  target_kind: VoteTargetKind;
  target_id: string;
  value: -1 | 1;
  created_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  last_message_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string;
}

export interface DirectMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
}

// Username validation matches DB check constraint
export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function isValidUsername(input: string): boolean {
  return USERNAME_REGEX.test(input);
}

export function normalizeUsername(input: string): string {
  return input.trim().toLowerCase();
}

// Usernames reserved for the system / routes. Shared so the client can reject
// them before creating an account (kept in sync with /api/profile/username).
export const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "root",
  "support",
  "moderator",
  "claude",
  "anthropic",
  "system",
  "official",
  "staff",
  "moi",
  "me",
  "you",
  "null",
  "undefined",
  "api",
  "auth",
  "login",
  "signup",
  "settings",
  "profil",
  "profile",
  "u",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username);
}
