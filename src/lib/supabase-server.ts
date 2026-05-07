import { createServerClient } from "@supabase/ssr";
import { cookies }            from "next/headers";
import { createClient }       from "@supabase/supabase-js";
import type { Database }      from "@/types/database";

const URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SRK      = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── Server client — use inside Server Components / Actions ────
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(URL, ANON_KEY, {
    cookies: {
      getAll()     { return cookieStore.getAll(); },
      setAll(list) { list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); },
    },
  });
}

// ── Admin client — bypasses RLS, server-only ──────────────────
export const supabaseAdmin = createClient<Database>(URL, SRK, {
  auth: { autoRefreshToken: false, persistSession: false },
});