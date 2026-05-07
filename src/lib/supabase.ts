// ============================================================
// src/lib/supabase.ts
// ── Browser client — use inside Client Components ─────────────
// ============================================================

import { createBrowserClient } from "@supabase/ssr";
import type { Database }       from "@/types/database";

const URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createBrowserClient<Database>(URL, ANON_KEY);

export function createBrowserSupabase() {
  return supabase;
}
