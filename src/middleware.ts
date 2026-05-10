// src/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// 1. إعداد ميدل وير اللغات
const intlMiddleware = createIntlMiddleware(routing);

// 2. خريطة المسارات الكاملة (تم نقلها من كودك السابق)
type UserRole = "user" | "agent" | "developer" | "admin";

const ROUTE_MAP: Array<{ path: string; roles: UserRole[] | null }> = [
  // Public (عام)
  { path: "/", roles: null },
  { path: "/properties", roles: null },
  { path: "/projects", roles: null },
  { path: "/courses", roles: null },
  { path: "/developers", roles: null },
  { path: "/contact", roles: null },
  { path: "/blog", roles: null },
  { path: "/about", roles: null },
  { path: "/auth/", roles: null },

  // Any authenticated user (أي مستخدم مسجل دخول)
  { path: "/profile", roles: ["user", "agent", "developer", "admin"] },
  { path: "/favorites", roles: ["user", "agent", "developer", "admin"] },
  { path: "/appointments", roles: ["user", "agent", "developer", "admin"] },
  { path: "/inquiries", roles: ["user", "agent", "developer", "admin"] },

  // Staff only (الوكلاء والمطورين)
  { path: "/dashboard", roles: ["agent", "developer", "admin"] },

  // Admin only (المديرين فقط)
  { path: "/admin", roles: ["admin"] },
];

const ROLE_HOME: Record<UserRole, string> = {
  user: "/profile",
  agent: "/dashboard",
  developer: "/dashboard",
  admin: "/admin",
};

// دالة مساعدة لتحديد الأدوار المطلوبة للمسار
function getRequiredRoles(cleanPath: string) {
  for (const route of ROUTE_MAP) {
    if (cleanPath === route.path || (route.path !== "/" && cleanPath.startsWith(route.path))) {
      return route.roles;
    }
  }
  return undefined; 
}

export async function middleware(request: NextRequest) {
  // إنشاء الاستجابة الأولية من ميدل وير اللغات
  let response = intlMiddleware(request);

  // إعداد Supabase Client داخل الميدل وير
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // جلب المستخدم الحالي
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(/^\/(ar|en)/);
  const localePrefix = localeMatch ? localeMatch[0] : "/ar";
  const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/";

  const requiredRoles = getRequiredRoles(cleanPath);

  // 1. إذا كان المسار غير معروف، اتركه لميدل وير اللغات
  if (requiredRoles === undefined) return response;

  // 2. معالجة المسارات العامة (Public)
  if (requiredRoles === null) {
    // لو مسجل دخول ويحاول يدخل صفحة اللوجن، وجهه لصفحته الرئيسية
    if (user && cleanPath.startsWith("/auth/")) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const role = (profile?.role as UserRole) || "user";
      return NextResponse.redirect(new URL(`${localePrefix}${ROLE_HOME[role]}`, request.url));
    }
    return response;
  }

  // 3. معالجة المسارات المحمية (Protected)
  if (!user) {
    const loginUrl = new URL(`${localePrefix}/auth/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // جلب بيانات الصلاحيات من الداتابيز
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role as UserRole;

  // تحقق إذا كان الحساب معطل (اختياري حسب منطقك)
  if (profile && profile.is_active === false) {
    return NextResponse.redirect(new URL(`${localePrefix}/auth/error?error=AccountDisabled`, request.url));
  }

  // التحقق من صلاحية الدور للوصول للمسار
  if (!userRole || !requiredRoles.includes(userRole)) {
    return NextResponse.redirect(new URL(`${localePrefix}/auth/unauthorized`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)).*)",
  ],
};