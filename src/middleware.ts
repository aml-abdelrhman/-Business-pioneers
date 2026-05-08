// ============================================================
// src/middleware.ts — Route Protection Middleware
// Protects routes based on authentication + role
// ============================================================

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import type { UserRole } from "@/types/database";

// إعداد إعدادات اللغة (يجب أن تتطابق مع ملف i18n.ts الخاص بك)
const intlMiddleware = createIntlMiddleware({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
});

// ─── Route access map ────────────────────────────────────────
// null  = public (anyone)
// []    = any authenticated user
// [roles] = specific roles only

const ROUTE_MAP: Record<string, UserRole[] | null> = {
  // ── Public routes ──────────────────────────────────────────
  "/":                 null,
  "/properties":       null,
  "/projects":         null,
  "/developers":       null,
  "/contact":          null,
  "/blog":             null,
  "/about":            null,
  "/auth/login":       null,
  "/auth/register":    null,
  "/auth/error":       null,
  "/auth/forgot":      null,
  "/auth/reset":       null,

  // ── Any authenticated user ─────────────────────────────────
  "/profile":          ["user", "agent", "developer", "admin"],
  "/favorites":        ["user", "agent", "developer", "admin"],
  "/appointments":     ["user", "agent", "developer", "admin"],
  "/inquiries":        ["user", "agent", "developer", "admin"],

  // ── Agent + Developer + Admin only ─────────────────────────
  "/dashboard":        ["agent", "developer", "admin"],
  "/dashboard/properties": ["agent", "developer", "admin"],
  "/dashboard/inquiries":  ["agent", "developer", "admin"],
  "/dashboard/appointments": ["agent", "developer", "admin"],
  "/dashboard/analytics":  ["agent", "developer", "admin"],

  // ── Admin only ─────────────────────────────────────────────
  "/admin":            ["admin"],
  "/admin/users":      ["admin"],
  "/admin/developers": ["admin"],
  "/admin/properties": ["admin"],
  "/admin/articles":   ["admin"],
  "/admin/settings":   ["admin"],
  "/admin/reports":    ["admin"],
};

// ─── Redirect map per role (after login) ─────────────────────
const ROLE_HOME: Record<UserRole, string> = {
  user:      "/profile",
  agent:     "/dashboard",
  developer: "/dashboard",
  admin:     "/admin",
};

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const session      = req.auth;
  const user         = session?.user;

  // Strip locale prefix (e.g. /ar/admin → /admin)
  const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/";

  // استخراج اللوكيل الحالي لإضافته في التحويلات (Redirects)
  // إذا كان اللوكيل غير موجود في الرابط، نفترض اللوكيل الافتراضي (ar)
  const matchedLocale = pathname.match(/^\/(ar|en)/)?.[0];
  const localePrefix = matchedLocale || "/ar";

  // Find matching route rule (exact match first, then prefix)
  let requiredRoles: UserRole[] | null | undefined = undefined;
  for (const [route, roles] of Object.entries(ROUTE_MAP)) {
    // نستخدم الـ cleanPath للتحقق من الصلاحيات
    if (cleanPath === route || (route !== "/" && cleanPath.startsWith(route + "/"))) {
      requiredRoles = roles;
      break;
    }
  }

  // Unknown route → allow (handled by Next.js 404)
  if (requiredRoles === undefined) return intlMiddleware(req);

  // Public route or Auth route
  if (requiredRoles === null || cleanPath.startsWith("/auth/")) {
    // Redirect already-logged-in users to their respective home (e.g., /admin)
    if (user && (cleanPath === "/" || cleanPath.startsWith("/auth/"))) {
      return NextResponse.redirect(
        new URL(`${localePrefix}${ROLE_HOME[user.role as UserRole] || "/"}`, req.url)
      );
    }
    return intlMiddleware(req);
  }

  // Protected route — must be authenticated
  if (!user) {
    const loginUrl = new URL(`${localePrefix}/auth/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Disabled account
  if (!user.is_active) {
    return NextResponse.redirect(new URL(`${localePrefix}/auth/error?error=AccountDisabled`, req.url));
  }

  // Check role
  if (!requiredRoles.includes(user.role as UserRole)) {
    return NextResponse.redirect(new URL(`${localePrefix}/auth/unauthorized`, req.url));
  }

  // ✅ Crucial: Always return intlMiddleware to handle locale rewriting
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and API routes
    "/((?!_next/static|_next/image|favicon.ico|api/|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|webmanifest|pdf)).*)",
  ],
};