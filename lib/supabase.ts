import { createClient } from "@supabase/supabase-js";

// Lazy initialization — only create the client when actually called,
// never at module-evaluation time (which breaks Next.js static builds).
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Make sure these are set in your environment variables."
      );
    }
    _client = createClient(url, key);
  }
  return _client;
}

// Keep a default export for backwards-compat, but LAZY
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});
