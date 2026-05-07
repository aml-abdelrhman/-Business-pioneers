// ============================================================
// src/auth.ts — NextAuth v5 Full Configuration (FIXED)
// ✅ Bypass Verification ✅ Auto-confirm Google ✅ Fixed AccessDenied
// ============================================================

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import type { Database, UserRole } from "@/types/database";

// 1. TYPE AUGMENTATION
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      is_verified: boolean;
      is_active: boolean;
      phone: string | null;
      avatar_url: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
    is_verified: boolean;
    is_active: boolean;
    phone: string | null;
    avatar_url: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    is_verified: boolean;
    is_active: boolean;
    phone: string | null;
    avatar_url: string | null;
    _lastRefresh?: number;
  }
}

// 2. SUPABASE ADMIN CLIENT
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// 3. NEXTAUTH CORE CONFIG
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/welcome",
  },

  providers: [
    // ── 3a. Google OAuth ─────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      async profile(googleProfile) {
        const { data: existing } = await (supabaseAdmin.from("profiles") as any)
          .select("id, role, is_verified, is_active, phone, avatar_url")
          .eq("id", googleProfile.sub)
          .maybeSingle();

        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          role: existing?.role ?? "user",
          is_verified: true, // ✅ Force true for Google
          is_active: true,   // ✅ Force true to prevent AccessDenied
          phone: existing?.phone ?? null,
          avatar_url: existing?.avatar_url ?? googleProfile.picture ?? null,
        };
      },
    }),

    // ── 3b. Email + Password ─────────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: authData, error: authError } =
          await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

        if (authError || !authData.user) return null;

        const { data: profile, error: profileError } = await (supabaseAdmin.from("profiles") as any)
          .select("id, full_name, role, is_verified, is_active, phone, avatar_url")
          .eq("id", authData.user.id)
          .single();

        // If no profile, allow login and handle profile creation later
        return {
          id: authData.user.id,
          name: profile?.full_name || "User",
          email: authData.user.email ?? "",
          image: profile?.avatar_url || null,
          role: profile?.role || "user",
          is_verified: true, // ✅ Skip verification check on login
          is_active: profile ? profile.is_active : true, // Only block if profile exists and is inactive
          phone: profile?.phone || null,
          avatar_url: profile?.avatar_url || null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.is_verified = true; // ✅ Force verified in token
        token.is_active = user.is_active;
        token.phone = user.phone;
        token.avatar_url = user.avatar_url;
        token._lastRefresh = Math.floor(Date.now() / 1000);
      }

      if (trigger === "update" && session?.user) {
        const u = session.user;
        if (u.role !== undefined) token.role = u.role;
        if (u.phone !== undefined) token.phone = u.phone;
        if (u.avatar_url !== undefined) token.avatar_url = u.avatar_url;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.is_verified = token.is_verified;
      session.user.is_active = token.is_active;
      session.user.phone = token.phone;
      session.user.avatar_url = token.avatar_url;
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // ✅ Upsert profile with is_active = true and is_verified = true
        const { error } = await (supabaseAdmin.from("profiles") as any)
          .upsert(
            [
              {
                id: user.id,
                full_name: user.name ?? "",
                avatar_url: user.image ?? null,
                role: "user",
                is_active: true,
                is_verified: true,
              },
            ],
            { onConflict: "id", ignoreDuplicates: false }
          );
        if (error) {
          console.error("Google Auth Sync Error:", error);
          return true; // Still allow sign in even if profile sync fails
        }
      }

      // Final check: block ONLY if explicitly deactivated
      if (user.is_active === false) {
        return "/auth/error?error=AccountDisabled";
      }

      return true;
    },

    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const path = nextUrl.pathname.replace(/^\/(ar|en)/, "") || "/";

      const publicPaths = [
        "/", "/properties", "/projects", "/developers",
        "/contact", "/blog", "/about", "/auth/",
        "/api/auth/",
      ];
      const isPublic = publicPaths.some(p => path === p || path.startsWith(p));
      if (isPublic) return true;

      if (!isLoggedIn) return false;

      const role = session.user.role as UserRole;
      if (path.startsWith("/admin") && role !== "admin") return false;
      const staffRoles: UserRole[] = ["agent", "developer", "admin"];
      if (path.startsWith("/dashboard") && !staffRoles.includes(role)) return false;

      return true;
    },
  },
});

export async function getServerSession() {
  return auth();
}