// Browser-side Supabase client that persists the session in COOKIES
// (not localStorage). Required so the server-side proxy/middleware can
// detect logged-in users and so /api routes see the same session.

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

type AnySupabaseClient = SupabaseClient;

let _client: AnySupabaseClient | null = null;

export function getSupabase(): AnySupabaseClient {
  if (typeof window === "undefined") {
    throw new Error(
      "getSupabase() may only be called from the browser. " +
        "Use createServerClient (from @supabase/ssr) in server code."
    );
  }
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }
    _client = createBrowserClient(url, key);
  }
  return _client;
}

// Backwards-compat lazy default export — same Proxy pattern as before.
export const supabase = new Proxy({} as AnySupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as never)[prop as never];
  },
});
