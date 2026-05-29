import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cookie-bound Supabase client for Server Components / Route Handlers.
// Reads the session from the user's cookies — respects RLS as the user.
export async function getServerSupabase() {
  const store = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (toSet) => {
          for (const { name, value, options } of toSet) {
            try {
              store.set(name, value, options);
            } catch {
              // No-op when called from a Server Component (read-only cookies)
            }
          }
        },
      },
    }
  );
}

// Service-role client — bypasses RLS. Use for trusted server actions
// (admin operations, sign-up flows). NEVER expose to the browser.
let _admin: SupabaseClient | null = null;
export function getServiceSupabase(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for service client."
    );
  }
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
