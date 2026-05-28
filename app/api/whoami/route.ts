import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isAdminEmail, adminEmails } from "@/lib/admin";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return NextResponse.json({
    user: user
      ? {
          id: user.id,
          email: user.email,
          provider: user.app_metadata?.provider,
        }
      : null,
    adminCheck: {
      isAdmin: isAdminEmail(user?.email),
      adminAllowlist: adminEmails(),
      env_NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? null,
      env_ADMIN_EMAILS: process.env.ADMIN_EMAILS ?? null,
    },
  });
}
