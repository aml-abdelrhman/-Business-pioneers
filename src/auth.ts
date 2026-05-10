// ============================================================
// src/auth.ts
// ============================================================

import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import type { Database, UserRole } from "@/types/database";

// ── 1. TYPE AUGMENTATION ──────────────────────────────────────
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

// ── 2. SUPABASE ADMIN CLIENT ──────────────────────────────────
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const REFRESH_INTERVAL = 5 * 60; // 5 دقايق

// ── 3. NEXTAUTH CONFIG ────────────────────────────────────────
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/welcome",
  },

  providers: [
    // ── Google OAuth ─────────────────────────────────────────
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
          role: (existing?.role ?? "user") as UserRole,
          is_verified: true,
          is_active: existing ? existing.is_active : true,
          phone: existing?.phone ?? null,
          avatar_url: existing?.avatar_url ?? googleProfile.picture ?? null,
        };
      },
    }),

    // ── Email + Password ──────────────────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. تحقق من الـ credentials عبر Supabase Auth
        const { data: authData, error: authError } =
          await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

        if (authError || !authData.user) return null;

        // 2. جيب الـ profile بالـ id مش الـ email
        const { data: profile } = await (supabaseAdmin.from("profiles") as any)
          .select("id, full_name, role, is_verified, is_active, phone, avatar_url")
          .eq("id", authData.user.id)
          .maybeSingle();

        // 3. لو الأكاونت متوقف، ارفض الدخول
        if (profile && profile.is_active === false) return null;

        return {
          id: authData.user.id,
          name: profile?.full_name ?? authData.user.email ?? "User",
          email: authData.user.email ?? "",
          image: profile?.avatar_url ?? null,
          role: (profile?.role ?? "user") as UserRole,
          is_verified: true,
          is_active: profile ? profile.is_active : true,
          phone: profile?.phone ?? null,
          avatar_url: profile?.avatar_url ?? null,
        };
      },
    }),
  ],

  callbacks: {
    // ── JWT ───────────────────────────────────────────────────
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.is_active = user.is_active;
        token.is_verified = user.is_verified;
        token.phone = user.phone;
        token.avatar_url = user.avatar_url;
      }

      const validRoles: UserRole[] = ["user", "agent", "developer", "admin"];

      // تحديث البيانات من قاعدة البيانات عند الطلب أو إذا كان الدور غير صالح
      if (trigger === "update" || (token.id && !validRoles.includes(token.role as UserRole))) {
        const { data: profile } = await (supabaseAdmin.from("profiles") as any)
          .select("role, is_verified, is_active, phone, avatar_url, full_name")
          .eq("id", token.id)
          .maybeSingle();

        if (profile) {
          token.role = profile.role;
          token.is_verified = profile.is_verified;
          token.is_active = profile.is_active;
          token.phone = profile.phone;
          token.avatar_url = profile.avatar_url;
        }
      }

      return token;
    },

    // ── Session ───────────────────────────────────────────────
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.is_verified = token.is_verified;
        session.user.is_active = token.is_active;
        session.user.phone = token.phone;
        session.user.avatar_url = token.avatar_url;
      }
      return session;
    },

    // ── SignIn ────────────────────────────────────────────────
    async signIn({ user, account }) {
      // بلوك الأكاونتات المعطلة
      if (user.is_active === false) {
        return "/auth/error?error=AccountDisabled";
      }

      if (account?.provider === "google") {
        const { error } = await (supabaseAdmin.from("profiles") as any).upsert(
          [
            {
              id: user.id,
              full_name: user.name ?? "",
              avatar_url: user.image ?? null,
              role: user.role,
              is_active: true,
              is_verified: true,
            },
          ],
          { onConflict: "id", ignoreDuplicates: false }
        );

        if (error) {
          console.error("Google Auth Sync Error:", error);
          // لا نوقف الدخول لو فشل الـ upsert
        }
      }

      return true;
    },

    // ── Authorized (Middleware check) ─────────────────────────
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const path = nextUrl.pathname.replace(/^\/(ar|en)/, "") || "/";

      const publicPaths = [
        "/",
        "/properties",
        "/projects",
        "/developers",
        "/contact",
        "/blog",
        "/about",
        "/auth/",
        "/api/auth/",
      ];

      const isPublic = publicPaths.some(
        (p) => path === p || path.startsWith(p)
      );
      if (isPublic) return true;
      if (!isLoggedIn) return false;

      const role = session?.user?.role as UserRole | undefined;
      const validRoles: UserRole[] = ["user", "agent", "developer", "admin"];

      // إذا كان الدور غير موجود أو غير صالح، ارفض (سيتم التوجيه لصفحة تسجيل الدخول)
      if (!role || !validRoles.includes(role)) return false;

      // حماية مسارات الأدمن
      if (
        (path === "/admin" || path.startsWith("/admin/")) &&
        role !== "admin"
      ) {
        // بدلاً من إرجاع false (الذي يوجه للـ login)، نوجهه للرئيسية
        return Response.redirect(new URL("/", nextUrl.origin));
      }

      // حماية مسارات الموظفين (Dashboard)
      const staffRoles: UserRole[] = ["agent", "developer", "admin"];
      if (
        (path === "/dashboard" || path.startsWith("/dashboard/")) &&
        !staffRoles.includes(role)
      ) {
        // لو مستخدم عادي حاول يدخل الداشبورد، يرجعه للرئيسية
        return Response.redirect(new URL("/", nextUrl.origin));
      }

      return true;
    },
  },
});

export async function getServerSession() {
  return auth();
}