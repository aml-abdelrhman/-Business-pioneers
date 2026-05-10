"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  MenuIcon,
  X,
  LayoutDashboard,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { ThemeToggle } from "./ThemeToggle";
import type { UserRole } from "@/types/database";
import { supabase } from "@/lib/supabase";

// ── Role → Path ───────────────────────────────────────────────
const ROLE_HOME: Record<UserRole, string> = {
  user:      "/profile",
  agent:     "/dashboard",
  developer: "/dashboard",
  admin:     "/admin",
};

function getDashboardPath(role?: UserRole): string {
  return ROLE_HOME[role!] ?? "/profile";
}

// ── LangSelector ─────────────────────────────────────────────
const LangSelector = ({ isScrolled }: { isScrolled: boolean }) => {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all text-xs border",
            isScrolled
              ? "bg-white/10 text-blue-900 dark:text-white border-blue-900/10 hover:bg-white/20"
              : "bg-white/10 text-white border-white/20 hover:bg-white/20"
          )}
        >
          {locale === "en" ? "EN" : "ع"}
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-28 p-1 rounded-xl shadow-xl bg-white dark:bg-slate-900 border-none z-[110]"
        align="end"
      >
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(lang) => router.push(pathname, { locale: lang })}
        >
          <DropdownMenuRadioItem
            value="en"
            className="flex justify-center font-bold py-1.5 text-xs rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/40"
          >
            English
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value="ar"
            className="flex justify-center font-bold py-1.5 text-xs rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/40"
          >
            العربية
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ── Navbar ────────────────────────────────────────────────────
export const Navbar = () => {
  const t        = useTranslations("nav");
  const pathname = usePathname();
  const locale   = useLocale();
  const router   = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen]         = useState(false);
  
  // ✅ استخدام Supabase مباشرة للسرعة والدقة (Direct Access)
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // جلب الجلسة فوراً من التخزين المحلي (LocalStorage)
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // جلب الرتبة مباشرة من البروفايل
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single() as any;
        setUserRole(profile?.role as UserRole);
      }
      setReady(true);
    };

    initAuth();

    // الاستماع لأي تغيير في حالة تسجيل الدخول (دخول/خروج) وتحديث الواجهة فوراً
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single() as any;
        setUserRole(profile?.role as UserRole);
      } else {
        setUser(null);
        setUserRole(undefined);
      }
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const dashboardPath  = getDashboardPath(userRole);
  // استخراج الاسم من البيانات الوصفية أو الإيميل
  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  const dashboardLabel =
    userRole === "admin"
      ? t("adminPanel")
      : userRole === "agent" || userRole === "developer"
      ? t("dashboard")
      : userName;

  const navigationItems = [
    { label: t("works"),    href: "/" },
    { label: t("about"),    href: "/nav-pages" },
    { label: t("board"),    href: "/Careers" },
    { label: t("chairman"), href: "/Methodology" },
    { label: t("contact"),  href: "/servics" },
    { label: t("last"),     href: "/contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-4 md:px-10",
        isScrolled
          ? "py-2 backdrop-blur-xl shadow-md"
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-[1500px] mx-auto flex items-center justify-between">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 md:flex-row md:gap-4 group shrink-0"
        >
          <div
            className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-500 bg-white flex items-center justify-center shadow-xl",
              isScrolled ? "border-blue-900 scale-90" : "border-white scale-100"
            )}
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          <div className="flex flex-col leading-none uppercase shrink-0 min-w-[145px] md:min-w-[185px]">
            <div
              className={cn(
                "font-inter text-[9px] md:text-[11px] font-black transition-colors whitespace-nowrap flex justify-between w-full px-0.5",
                isScrolled ? "text-blue-900 dark:text-white" : "text-white"
              )}
            >
              <span>BUSINESS</span>
              <span>PIONEERS</span>
              <span>HOLDING</span>
            </div>
            <div className="flex items-center w-full pt-1 mt-1 border-t border-amber-500/40">
              <span
                className={cn(
                  "text-[18px] md:text-[22px] font-medium font-cairo block w-full text-center transition-colors tracking-tighter",
                  isScrolled ? "text-amber-600" : "text-amber-500"
                )}
              >
                رواد الأعمال القابضة
              </span>
            </div>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <div
          className={cn(
            "hidden xl:flex items-center gap-1 px-4 py-5 rounded-2xl transition-all duration-500 border w-fit ms-20",
            isScrolled
              ? "backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-sm"
              : "bg-white/5 backdrop-blur-sm border-white/10"
          )}
        >
          {navigationItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={cn(
                "group flex items-center gap-1 px-3 py-1.5 text-[13px] font-bold transition-all rounded-full hover:bg-[#D4AF37] hover:text-white",
                isScrolled ? "text-blue-900 dark:text-slate-200" : "text-white"
              )}
            >
              <span className="inline-block transition-transform duration-300 group-hover:rotate-90 opacity-70">
                ↖
              </span>
              {item.label}
            </Link>
          ))}

          <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-2" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangSelector isScrolled={isScrolled} />

            {/* نستخدم ready لضمان عدم حدوث Hydration Mismatch مع عرض البيانات فور توفرها */}
            {ready && user ? (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-4 text-xs font-bold text-white bg-blue-900 rounded-full hover:bg-blue-800"
                  onClick={() => router.push(`/${locale}${dashboardPath}`)}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />
                  {dashboardLabel}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => { await supabase.auth.signOut(); router.push(`/${locale}`); }}
                  className="w-8 h-8 text-red-500 rounded-full hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : ready && (
              <Button
                size="sm"
                onClick={() => router.push("/auth/login")}
                className="h-8 px-5 text-xs font-bold text-white transition-all border-none rounded-full shadow-sm bg-[#D4AF37] hover:opacity-90"
              >
                <LogIn className="w-3.5 h-3.5 mr-1.5" />
                {t("login")}
              </Button>
            )}
          </div>
        </div>

        {/* ── Mobile Nav ── */}
        <div className="flex items-center gap-3 xl:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  isScrolled ? "text-blue-900 dark:text-white" : "text-white"
                )}
              >
                <div className="flex items-center justify-center w-7 h-7">
                  {!isOpen && <MenuIcon className="w-7 h-7" />}
                </div>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:w-[300px] bg-white dark:bg-[#0b0f1a] border-none p-0 [&>button]:hidden"
            >
              <div
                className={cn(
                  "absolute left-4 md:left-10 z-[120] transition-all duration-500",
                  isScrolled ? "top-2" : "top-5"
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-blue-900 dark:text-white"
                >
                  <X className="w-7 h-7" />
                </Button>
              </div>

              <div className="flex flex-col h-full px-6 pt-32">
                <div className="flex flex-col flex-1 gap-2">
                  {navigationItems.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-4 text-sm font-bold transition-all border rounded-xl group bg-white/5 dark:bg-slate-800/50 border-white/10 hover:bg-[#D4AF37] hover:text-white"
                    >
                      <span className="inline-block transition-transform duration-300 group-hover:rotate-90 opacity-70">
                        ↖
                      </span>
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-6 mt-auto border-t dark:border-slate-800">
                  <div className="flex items-center justify-center gap-8 p-4 mb-6 border rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/50">
                    <ThemeToggle />
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
                    <LangSelector isScrolled={true} />
                  </div>

                  {ready && user ? (
                    <div className="flex flex-col gap-3">
                      <Button
                        className="w-full py-5 text-sm font-bold bg-blue-900 hover:bg-blue-800 text-white rounded-xl"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/${locale}${dashboardPath}`);
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {dashboardLabel}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full py-5 text-sm font-bold text-red-500 border-red-200 rounded-xl hover:bg-red-50"
                        onClick={async () => {
                          setIsOpen(false);
                          await supabase.auth.signOut();
                          router.push(`/${locale}`);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t("logout")}
                      </Button>
                    </div>
                  ) : ready && (
                    <Button
                      className="w-full py-6 text-lg font-bold bg-[#D4AF37] hover:opacity-90 text-white rounded-xl"
                      onClick={() => {
                        setIsOpen(false);
                        router.push("/auth/login");
                      }}
                    >
                      {t("login")}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};