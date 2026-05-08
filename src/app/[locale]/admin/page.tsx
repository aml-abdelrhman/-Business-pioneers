"use client";

// ============================================================

// src/app/[locale]/admin/page.tsx — Admin Dashboard Home

// Stats cards + Charts + Recent activity + Quick actions

// ============================================================

import { useRef } from "react";

import { motion, useInView } from "framer-motion";

import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";

import { useAppStore } from "@/store/useStore";

import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import {
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Heart,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  BarChart3,
  Activity,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────

const STATS = [
  {
    label: "إجمالي المستخدمين",

    value: "١٢,٤٨٠",

    change: "+١٢٪",

    up: true,

    icon: Users,

    color: "blue",

    sub: "٢٤٠ جديد هذا الشهر",
  },

  {
    label: "العقارات النشطة",

    value: "٤٥٣",

    change: "+٨٪",

    up: true,

    icon: Building2,

    color: "amber",

    sub: "٣٨ عقار بانتظار المراجعة",
  },

  {
    label: "الاستفسارات",

    value: "١,٢٩٣",

    change: "-٣٪",

    up: false,

    icon: MessageSquare,

    color: "blue",

    sub: "٥ استفسارات جديدة اليوم",
  },

  {
    label: "إجمالي المبيعات",

    value: "٢٣.٤M",

    change: "+١٨٪",

    up: true,

    icon: DollarSign,

    color: "amber",

    sub: "ريال سعودي هذا الشهر",
  },
];

const VIEWS_DATA = [
  { month: "يناير", views: 4200, inquiries: 320 },

  { month: "فبراير", views: 5800, inquiries: 410 },

  { month: "مارس", views: 4900, inquiries: 380 },

  { month: "أبريل", views: 7200, inquiries: 520 },

  { month: "مايو", views: 6800, inquiries: 480 },

  { month: "يونيو", views: 9100, inquiries: 680 },

  { month: "يوليو", views: 8400, inquiries: 620 },
];

const PROPERTY_TYPES_DATA = [
  { name: "شقق", value: 42, color: "#1e3a5f" },

  { name: "فلل", value: 28, color: "#f59e0b" },

  { name: "مكاتب", value: 15, color: "#3b82f6" },

  { name: "أراضي", value: 10, color: "#10b981" },

  { name: "دوبلكس", value: 5, color: "#8b5cf6" },
];

const CITY_SALES_DATA = [
  { city: "الرياض", sales: 180 },

  { city: "جدة", sales: 95 },

  { city: "الدمام", sales: 65 },

  { city: "مكة", sales: 42 },

  { city: "المدينة", sales: 28 },

  { city: "تبوك", sales: 19 },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    type: "user",
    text: "مستخدم جديد: أحمد محمد",
    time: "منذ ٥ دقائق",
    status: "success",
  },

  {
    id: 2,
    type: "property",
    text: "عقار جديد: شقة في النرجس",
    time: "منذ ١٢ دقيقة",
    status: "pending",
  },

  {
    id: 3,
    type: "inquiry",
    text: "استفسار جديد من سارة العمري",
    time: "منذ ٢٠ دقيقة",
    status: "info",
  },

  {
    id: 4,
    type: "property",
    text: "عقار مرفوض: فيلا في الياسمين",
    time: "منذ ٣٥ دقيقة",
    status: "error",
  },

  {
    id: 5,
    type: "user",
    text: "ترقية حساب: خالد إلى وكيل",
    time: "منذ ساعة",
    status: "success",
  },

  {
    id: 6,
    type: "inquiry",
    text: "استفسار مُغلق: طلب تقييم",
    time: "منذ ساعتين",
    status: "success",
  },
];

const PENDING_TASKS = [
  {
    id: 1,
    text: "مراجعة ٣٨ عقار بانتظار الموافقة",
    priority: "high",
    href: "/admin/properties?status=pending",
  },

  {
    id: 2,
    text: "التحقق من ١٢ حساب وكيل جديد",
    priority: "high",
    href: "/admin/users?role=agent&verified=false",
  },

  {
    id: 3,
    text: "الرد على ٥ استفسارات مفتوحة",
    priority: "medium",
    href: "/admin/inquiries?status=pending",
  },

  {
    id: 4,
    text: "مراجعة مقالتين بانتظار النشر",
    priority: "low",
    href: "/admin/articles?status=draft",
  },
];

// ─── Stat Card ────────────────────────────────────────────────

function StatCard({
  stat,
  index,
  darkMode,
  isInView,
}: {
  stat: (typeof STATS)[0];

  index: number;

  darkMode: boolean;

  isInView: boolean;
}) {
  const Icon = stat.icon;

  const isBlue = stat.color === "blue";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className={cn(
        "relative rounded-2xl p-5 border overflow-hidden",

        darkMode
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-slate-100",

        "hover:shadow-lg transition-shadow duration-300",
      )}
    >
      {/* BG deco */}

      <div
        className={cn(
          "absolute -top-4 -end-4 w-20 h-20 rounded-full opacity-10",

          isBlue ? "bg-blue-500" : "bg-amber-500",
        )}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",

            isBlue ? "bg-blue-900 text-white" : "bg-amber-500 text-blue-950",
          )}
        >
          <Icon size={20} />
        </div>

        <span
          className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",

            stat.up
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-rose-500/10 text-rose-500",
          )}
        >
          {stat.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}

          {stat.change}
        </span>
      </div>

      <div
        className={cn(
          "text-2xl font-black mb-1",
          darkMode ? "text-white" : "text-slate-900",
        )}
      >
        {stat.value}
      </div>

      <div
        className={cn(
          "text-sm font-semibold mb-1",
          darkMode ? "text-slate-300" : "text-slate-700",
        )}
      >
        {stat.label}
      </div>

      <div
        className={cn(
          "text-xs",
          darkMode ? "text-slate-500" : "text-slate-400",
        )}
      >
        {stat.sub}
      </div>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  darkMode,
  action,
}: {
  title: string;
  subtitle?: string;
  darkMode: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2
          className={cn(
            "text-base font-black",
            darkMode ? "text-white" : "text-slate-900",
          )}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className={cn(
              "text-xs mt-0.5",
              darkMode ? "text-slate-500" : "text-slate-400",
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────

function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2 shadow-xl text-xs",

        darkMode
          ? "bg-slate-800 border-slate-700 text-white"
          : "bg-white border-slate-200 text-slate-800",
      )}
    >
      <p className="mb-1 font-bold">{label}</p>

      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value.toLocaleString("ar-SA")}
        </p>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────

export default function AdminDashboard() {
  const { darkMode } = useAppStore();

  const locale = useLocale();

  const isRTL = locale === "ar";

  const ref = useRef(null);

  const isInView = useInView(ref, { once: true });

  const BackArrow = isRTL ? ArrowLeft : ArrowRight;

  const priorityColors = {
    high: { bg: "bg-rose-500/10", text: "text-rose-500", dot: "bg-rose-500" },

    medium: {
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      dot: "bg-amber-500",
    },

    low: { bg: "bg-blue-500/10", text: "text-blue-600", dot: "bg-blue-500" },
  };

  const activityColors = {
    success: { icon: CheckCircle2, color: "text-emerald-500" },

    pending: { icon: Clock, color: "text-amber-500" },

    info: { icon: AlertCircle, color: "text-blue-500" },

    error: { icon: XCircle, color: "text-rose-500" },
  };

  return (
    <div
      ref={ref}
      className="relative min-h-screen pb-12"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* مستطيل كحلي عرضي يبدأ من أعلى الصفحة */}

      <div className="relative z-10 px-4 space-y-10 pt-28 md:px-8">
        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-black">لوحة التحكم</h1>
            <p className="text-sm mt-0.5 text-blue-200/200">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/properties/new">
              <Button
                size="sm"
                className="gap-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-blue-900 to-blue-700"
              >
                <Plus size={14} />
                إضافة عقار
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard
              key={i}
              stat={stat}
              index={i}
              darkMode={darkMode}
              isInView={isInView}
            />
          ))}
        </div>

        {/* ── Charts row ── */}

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Area chart — views & inquiries */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={cn(
              "lg:col-span-2 rounded-2xl border p-5",

              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100",
            )}
          >
            <SectionHeader
              title="المشاهدات والاستفسارات"
              subtitle="آخر ٧ أشهر"
              darkMode={darkMode}
              action={
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-900" />

                    <span
                      className={darkMode ? "text-slate-400" : "text-slate-500"}
                    >
                      مشاهدات
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />

                    <span
                      className={darkMode ? "text-slate-400" : "text-slate-500"}
                    >
                      استفسارات
                    </span>
                  </span>
                </div>
              }
            />

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={VIEWS_DATA}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3} />

                    <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                  </linearGradient>

                  <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />

                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#1e293b" : "#f1f5f9"}
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 10,
                    fill: darkMode ? "#64748b" : "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: darkMode ? "#64748b" : "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                <Area
                  type="monotone"
                  dataKey="views"
                  name="مشاهدات"
                  stroke="#1e3a5f"
                  fill="url(#blueGrad)"
                  strokeWidth={2}
                  dot={false}
                />

                <Area
                  type="monotone"
                  dataKey="inquiries"
                  name="استفسارات"
                  stroke="#f59e0b"
                  fill="url(#amberGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart — property types */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={cn(
              "rounded-2xl border p-5",

              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100",
            )}
          >
            <SectionHeader title="أنواع العقارات" darkMode={darkMode} />

            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={PROPERTY_TYPES_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PROPERTY_TYPES_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: any) => {
                    // بنحول القيمة لرقم للتأكد، أو نتحقق من النوع
                    const numericValue = Number(value);

                    if (!isNaN(numericValue)) {
                      // إرجاع مصفوفة تحتوي على [القيمة المعدلة، اسم الحقل]
                      // لو مش عايزة تغيري اسم الحقل، سيبيه فاضي أو ابعتي الاسم التاني
                      return [`${numericValue}٪`, "القيمة"];
                    }

                    return [value, ""];
                  }}
                  contentStyle={{
                    background: darkMode ? "#1e293b" : "#fff",

                    border: darkMode
                      ? "1px solid #334155"
                      : "1px solid #e2e8f0",

                    borderRadius: 12,
                    fontSize: 11,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-1.5 mt-1">
              {PROPERTY_TYPES_DATA.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: d.color }}
                    />

                    <span
                      className={darkMode ? "text-slate-400" : "text-slate-600"}
                    >
                      {d.name}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "font-bold",
                      darkMode ? "text-white" : "text-slate-800",
                    )}
                  >
                    {d.value}٪
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom row ── */}

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Bar chart — sales by city */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.5 }}
            className={cn(
              "rounded-2xl border p-5",

              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100",
            )}
          >
            <SectionHeader title="المبيعات بالمدن" darkMode={darkMode} />

            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={CITY_SALES_DATA}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#1e293b" : "#f1f5f9"}
                />

                <XAxis
                  dataKey="city"
                  tick={{
                    fontSize: 10,
                    fill: darkMode ? "#64748b" : "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: darkMode ? "#64748b" : "#94a3b8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                <Bar
                  dataKey="sales"
                  name="المبيعات"
                  fill="#1e3a5f"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent activity */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            className={cn(
              "rounded-2xl border p-5",

              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100",
            )}
          >
            <SectionHeader
              title="آخر النشاطات"
              darkMode={darkMode}
              action={
                <Link
                  href="/admin/activity"
                  className={cn(
                    "text-xs font-bold hover:underline",
                    darkMode ? "text-amber-400" : "text-blue-700",
                  )}
                >
                  عرض الكل
                </Link>
              }
            />

            <div className="space-y-3">
              {RECENT_ACTIVITIES.map((activity) => {
                const { icon: AIcon, color } =
                  activityColors[
                    activity.status as keyof typeof activityColors
                  ];

                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <AIcon
                      size={15}
                      className={cn("mt-0.5 flex-shrink-0", color)}
                    />

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-xs font-medium truncate",
                          darkMode ? "text-slate-300" : "text-slate-700",
                        )}
                      >
                        {activity.text}
                      </p>

                      <p
                        className={cn(
                          "text-[10px] mt-0.5",
                          darkMode ? "text-slate-500" : "text-slate-400",
                        )}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Pending tasks */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.65, duration: 0.5 }}
            className={cn(
              "rounded-2xl border p-5",

              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100",
            )}
          >
            <SectionHeader
              title="المهام المعلقة"
              subtitle={`${PENDING_TASKS.length} مهام تنتظر`}
              darkMode={darkMode}
            />

            <div className="space-y-2.5">
              {PENDING_TASKS.map((task) => {
                const p =
                  priorityColors[task.priority as keyof typeof priorityColors];

                return (
                  <Link key={task.id} href={task.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group",

                        darkMode
                          ? "border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50",
                      )}
                    >
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full flex-shrink-0",
                          p.dot,
                        )}
                      />

                      <span
                        className={cn(
                          "text-xs flex-1",
                          darkMode ? "text-slate-300" : "text-slate-700",
                        )}
                      >
                        {task.text}
                      </span>

                      <BackArrow
                        size={13}
                        className={cn(
                          "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                          darkMode ? "text-slate-400" : "text-slate-400",
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
