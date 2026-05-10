"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useStore";
import { useAdminGuard } from "@/hooks/useAuth"; // تأكدي أن هذا الهوك يتحقق من الـ Role
import { Link } from "@/i18n/navigation";
import { logoutAction } from "@/actions/auth.actions";
import { supabase } from "@/lib/supabase"; // استيراد سوبابيز

import {
  LayoutDashboard, Users, Building2, FileText, Settings,
  X, LogOut, TrendingUp, Shield, MessageSquare, Calendar,
  Bell, ChevronDown
} from "lucide-react";

// ─── Sidebar Component ─────────────────────────────────────────

function Sidebar({
  collapsed, darkMode, locale, pathname, onClose, 
  dynamicBadges // استلام الـ Badges الحية
}: any) {
  const isRTL = locale === "ar";
  const cleanPath = pathname.replace(/^\/(ar|en)/, "") || "/admin";

  const NAV_GROUPS = [
    {
      group: isRTL ? "الرئيسية" : "Main",
      items: [
        { label: isRTL ? "لوحة التحكم" : "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: isRTL ? "التقارير" : "Reports", href: "/admin/reports", icon: TrendingUp },
      ],
    },
    {
      group: isRTL ? "الإدارة" : "Management",
      items: [
        { label: isRTL ? "المستخدمون" : "Users", href: "/admin/users", icon: Users },
        { 
          label: isRTL ? "العقارات" : "Properties", 
          href: "/admin/properties", 
          icon: Building2,
          badge: dynamicBadges.pendingProperties > 0 ? dynamicBadges.pendingProperties : null 
        },
        { label: isRTL ? "المطورون" : "Developers", href: "/admin/developers", icon: Shield },
        {
          label: isRTL ? "الاستفسارات" : "Inquiries",
          href: "/admin/inquiries",
          icon: MessageSquare,
          badge: dynamicBadges.inquiries > 0 ? dynamicBadges.inquiries : null,
        },
      ],
    },
  ];

  return (
    <aside className={cn(
      "flex flex-col h-full transition-all duration-300 border-e relative z-20",
      darkMode ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200"
    )}>
      {/* Admin Profile Info */}
      <div className={cn(
        "p-6 border-b flex items-center gap-3",
        darkMode ? "border-slate-800" : "border-slate-100"
      )}>
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
          A
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter">Admin Panel</p>
            <p className={cn("text-sm font-black truncate", darkMode ? "text-white" : "text-slate-900")}>
              أمل عبد الرحمن
            </p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map(({ group, items }) => (
          <div key={group}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 mb-4 text-slate-500">
                {group}
              </p>
            )}
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = cleanPath === item.href || (item.href !== "/admin" && cleanPath.startsWith(item.href));

              return (
                <Link key={item.href} href={item.href} onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all text-sm font-bold mb-1 group relative",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={18} />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {item.badge && !collapsed && (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={cn("p-4 border-t", darkMode ? "border-slate-800" : "border-slate-100")}>
        <form action={logoutAction}>
          <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors">
            <LogOut size={18} />
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}

// ─── Main Admin Layout ────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { darkMode } = useAppStore();
  const locale = useLocale();
  const pathname = usePathname();
  const { user, isLoading } = useAdminGuard(); // يتأكد من أن role === 'admin'
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [badges, setBadges] = useState({ pendingProperties: 0, inquiries: 0 });

  // جلب البيانات الحية للـ Badges
  useEffect(() => {
    const fetchBadges = async () => {
      const { count: propCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // هنا يمكنك إضافة استعلام لجدول الاستفسارات أيضاً
      setBadges({
        pendingProperties: propCount || 0,
        inquiries: 5 // مثال ثابت حتى يتوفر جدول الاستفسارات
      });
    };

    fetchBadges();
    
    // إغلاق المنيو في الموبايل عند تغيير الصفحة
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading) return (
    <div className={cn("h-screen flex items-center justify-center", darkMode ? "bg-slate-950" : "bg-slate-50")}>
       <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className={cn("flex h-screen overflow-hidden", darkMode ? "bg-[#020617]" : "bg-[#f8fafc]")} dir={locale === "ar" ? "rtl" : "ltr"}>
      
      {/* Desktop Sidebar */}
      <motion.div 
        animate={{ width: collapsed ? 80 : 280 }} 
        className="hidden lg:block shrink-0"
      >
        <Sidebar 
          collapsed={collapsed} 
          darkMode={darkMode} 
          locale={locale} 
          pathname={pathname}
          dynamicBadges={badges}
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Top Header */}
        <header className={cn(
          "h-20 flex items-center justify-between px-8 border-b z-10 backdrop-blur-md",
          darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white/50 border-slate-100"
        )}>
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <LayoutDashboard className="text-blue-600" size={20} />
          </button>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden md:flex">
                <span className={cn("text-sm font-black", darkMode ? "text-white" : "text-slate-900")}>
                  {user?.email}
                </span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Online • Admin</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${user?.email}&background=0D8ABC&color=fff`} alt="admin" />
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-transparent relative">
          {/* Subtle Glow Effect */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Logic (بسيط ومختصر) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div 
              initial={{ x: locale === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }} exit={{ x: locale === 'ar' ? '100%' : '-100%' }}
              className="w-72 h-full bg-white dark:bg-slate-900"
              onClick={e => e.stopPropagation()}
            >
              <Sidebar collapsed={false} darkMode={darkMode} locale={locale} pathname={pathname} dynamicBadges={badges} onClose={() => setMobileOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mobile Toggle */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40"
      >
        <Shield size={24} />
      </button>
    </div>
  );
}