"use client";

// ============================================================

// src/app/[locale]/admin/layout.tsx — Admin Shell Layout

// Sidebar + Topbar + Content area

// ============================================================

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { usePathname } from "next/navigation";

import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";

import { useAppStore } from "@/store/useStore";

import { useAdminGuard } from "@/hooks/useAuth";

import { Link } from "@/i18n/navigation";

import { logoutAction } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Settings,
  X,
  LogOut,
  TrendingUp,
  Shield,
  MessageSquare,
  Calendar,
} from "lucide-react";

// ─── Nav items ────────────────────────────────────────────────

interface NavItem {
  label: string;

  href: string;

  icon: React.ElementType;

  badge?: string | number;

  color?: string;
}

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: "الرئيسية",

    items: [
      { label: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },

      { label: "التقارير", href: "/admin/reports", icon: TrendingUp },
    ],
  },

  {
    group: "الإدارة",

    items: [
      { label: "المستخدمون", href: "/admin/users", icon: Users, badge: "جديد" },

      { label: "العقارات", href: "/admin/properties", icon: Building2 },

      { label: "المطورون", href: "/admin/developers", icon: Shield },

      {
        label: "الاستفسارات",
        href: "/admin/inquiries",
        icon: MessageSquare,
        badge: 5,
      },

      { label: "المواعيد", href: "/admin/appointments", icon: Calendar },
    ],
  },

  {
    group: "المحتوى",

    items: [{ label: "المقالات", href: "/admin/articles", icon: FileText }],
  },

  {
    group: "النظام",

    items: [{ label: "الإعدادات", href: "/admin/settings", icon: Settings }],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────

function Sidebar({
  collapsed,

  darkMode,

  locale,

  pathname,

  onClose,
}: {
  collapsed: boolean;

  darkMode: boolean;

  locale: string;

  pathname: string;

  onClose?: () => void;
}) {
  const isRTL = locale === "ar";

  const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/admin";

  return (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-300",

        darkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-200",

        "border-e",
      )}
    >
      {/* Logo */}

      <div
        className={cn(
          "flex items-center gap-3 px-4 py-15 border-b",

          darkMode ? "border-slate-800" : "border-slate-100",
        )}
      >
      

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
             

          
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close */}

        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "ms-auto",
              darkMode ? "text-slate-400" : "text-slate-500",
            )}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}

      <nav className="flex-1 px-2 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map(({ group, items }) => (
          <div key={group}>
            {/* Group label */}

            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-3 mb-1.5",

                    darkMode ? "text-slate-600" : "text-slate-400",
                  )}
                >
                  {group}
                </motion.p>
              )}
            </AnimatePresence>

            {items.map((item) => {
              const Icon = item.icon;

              const isActive =
                cleanPath === item.href ||
                (item.href !== "/admin" && cleanPath.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold mb-0.5 group relative",

                    isActive
                      ? darkMode
                        ? "bg-blue-950 text-blue-300 border border-blue-900/60"
                        : "bg-blue-50 text-blue-900 border border-blue-100"
                      : darkMode
                        ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {/* Active indicator */}

                  {isActive && (
                    <span
                      className={cn(
                        "absolute inset-y-2 w-0.5 rounded-full",

                        isRTL ? "right-0" : "left-0",

                        "bg-amber-500",
                      )}
                    />
                  )}

                  <Icon
                    size={17}
                    className={cn(
                      "flex-shrink-0",

                      isActive ? "text-amber-500" : "",
                    )}
                  />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}

                  {item.badge !== undefined && !collapsed && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-full",

                        typeof item.badge === "number"
                          ? "bg-rose-500 text-white"
                          : darkMode
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-amber-100 text-amber-700",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}

      <div
        className={cn(
          "p-3 border-t",
          darkMode ? "border-slate-800" : "border-slate-100",
        )}
      >
        <form action={logoutAction}>
          <button
            type="submit"
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",

              darkMode
                ? "text-slate-400 hover:bg-rose-950 hover:text-rose-400"
                : "text-slate-500 hover:bg-rose-50 hover:text-rose-600",
            )}
          >
            <LogOut size={17} className="flex-shrink-0" />

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  تسجيل الخروج
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </form>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────

// ─── Admin Layout ─────────────────────────────────────────────

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { darkMode, toggleDarkMode } = useAppStore();

  const locale = useLocale();

  const pathname = usePathname();

  const { user, isLoading } = useAdminGuard();

  const [collapsed, setCollapsed] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          darkMode ? "bg-slate-950" : "bg-slate-50",
        )}
      >
        <div className="w-8 h-8 border-2 border-blue-700 rounded-full border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
   <div
  className={cn(
    "flex h-screen overflow-hidden transition-colors duration-300",
    // الوضع المظلم: كحلي عميق جداً | الوضع الفاتح: كحلي فاتح مائل للرمادي أو أوف وايت بارد
    darkMode 
      ? "bg-[#0f172a] text-slate-200" 
      : "bg-[#f8fafc] text-slate-900",
  )}
  dir={locale === "ar" ? "rtl" : "ltr"}
>
  {/* إضافة خلفية متدرجة بسيطة (Neon Glow) لتعزيز شكل الـ Glassmorphism في الداشبورد */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className={cn(
      "absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20",
      darkMode ? "bg-blue-600" : "bg-blue-300"
    )} />
  </div>
      {/* ── Desktop sidebar ── */}
<div 
        className="absolute top-0 inset-x-0 h-[100px] bg-[#020617] shadow-xl border-b border-white/5" 
        style={{ zIndex: 0 }} 
      />
      <motion.div
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="flex-shrink-0 hidden h-full overflow-hidden lg:block"
      >
        <div className="h-full" style={{ width: collapsed ? 64 : 240 }}>
          <Sidebar
            collapsed={collapsed}
            darkMode={darkMode}
            locale={locale}
            pathname={pathname}
          />
        </div>
      </motion.div>

      {/* ── Mobile sidebar overlay ── */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            />

            <motion.div
              initial={{ x: locale === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed top-0 h-full w-64 z-50 lg:hidden",

                locale === "ar" ? "right-0" : "left-0",
              )}
            >
              <Sidebar
                collapsed={false}
                darkMode={darkMode}
                locale={locale}
                pathname={pathname}
                onClose={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Scrollable content area */}

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
