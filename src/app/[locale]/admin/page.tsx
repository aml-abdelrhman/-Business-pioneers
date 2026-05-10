"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers, FiHome, FiTrendingUp, 
  FiBell, FiSearch, FiClock, FiCheck, FiX, FiActivity
} from "react-icons/fi";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { supabase } from "@/lib/supabase";
import { toast, Toaster } from "react-hot-toast";

interface StatItem { id: number; label: string; value: string; icon: React.ReactNode; color: string; sub: string; }
interface ActivityItem { id: string; text: string; time: string; status: 'success' | 'pending'; }
interface ChartDataItem { name: string; value: number; }
interface Project { id: string; title_ar: string; created_at: string; status_ar: string; city_ar: string | null; property_type_ar: string | null; }

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [realProjects, setRealProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkRoleAndFetch = async () => {
      setLoading(true);
      try {
        // 1. التحقق من هوية المستخدم
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        // 2. التحقق من الرتبة (Admin Check)
        const { data: profile } = await (supabase
          .from('profiles') as any)
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          toast.error("غير مسموح لك بدخول هذه الصفحة");
          router.push("/"); // توجيه لليوزر العادي للرئيسية
          return;
        }

        // 3. جلب البيانات إذا كان المستخدم أدمن
        await fetchAllData();
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkRoleAndFetch();
  }, []);

  const fetchAllData = async () => {
    try {
      const { count: usersCount } = await (supabase.from('profiles') as any).select('*', { count: 'exact', head: true });
      const { data, error: projectsError } = await (supabase.from('projects') as any).select('*').order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      const projects = (data as Project[]) || [];

      setStats([
        { id: 1, label: "إجمالي المستخدمين", value: (usersCount || 0).toLocaleString("ar-SA"), icon: <FiUsers />, color: "bg-blue-600", sub: "عضو مسجل" },
        { id: 2, label: "العقارات المدرجة", value: projects.length.toLocaleString("ar-SA"), icon: <FiHome />, color: "bg-indigo-600", sub: "عقار نشط" },
        { id: 3, label: "بانتظار المراجعة", value: projects.filter(p => p.status_ar !== 'نشط').length.toLocaleString("ar-SA"), icon: <FiClock />, color: "bg-amber-500", sub: "طلبات معلقة" },
        { id: 4, label: "أداء المنصة", value: "٩٤٪", icon: <FiTrendingUp />, color: "bg-emerald-500", sub: "نسبة نمو مستقرة" },
      ]);

      const cityGroups = projects.reduce((acc: any, curr) => {
        const city = curr.city_ar || "أخرى";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {});

      setChartData(Object.keys(cityGroups).map(city => ({ name: city, value: cityGroups[city] })).slice(0, 5));
      setRealProjects(projects.slice(0, 6));
      setRecentActivities(projects.slice(0, 5).map(p => ({
        id: p.id, text: `مشروع جديد: ${p.title_ar}`, time: new Date(p.created_at).toLocaleDateString("ar-SA"), status: p.status_ar === 'نشط' ? 'success' : 'pending'
      })));
    } catch (e) { toast.error("خطأ في جلب البيانات"); }
  };

  const updateStatus = async (id: string, s: string) => {
    const { error } = await (supabase.from('projects') as any).update({ status_ar: s }).eq('id', id);
    if (!error) { toast.success("تم التحديث"); fetchAllData(); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
        <p className="text-slate-400 font-bold animate-pulse">جاري التحقق من الصلاحيات...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-12 font-sans" dir="rtl">
      <Toaster position="top-center" />
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">لوحة القيادة <FiActivity className="text-blue-600" /></h1>
          <p className="text-slate-400 mt-2 font-medium">مرحباً بكِ في واجهة الإدارة الاحترافية.</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map(s => (
          <div key={s.id} className="bg-slate-900 p-6 rounded-[28px] border border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-white text-xl mb-4`}>{s.icon}</div>
            <h3 className="text-3xl font-black text-white">{s.value}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[35px] border border-slate-800 shadow-sm h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '15px', border: 'none'}} itemStyle={{color: '#fff'}} />
              <Bar dataKey="value" fill="#2563eb" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-slate-900 p-8 rounded-[35px] border border-slate-800 shadow-sm">
          <h3 className="font-black mb-6 text-white flex items-center gap-2"><FiClock className="text-blue-500" /> آخر النشاطات</h3>
          <div className="space-y-6">
            {recentActivities.map(a => (
              <div key={a.id} className="flex gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${a.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <p className="font-bold text-slate-300">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 bg-slate-900 rounded-[35px] border border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-slate-800/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6">المشروع</th><th className="p-6 text-center">المدينة</th><th className="p-6 text-center">الحالة</th><th className="p-6 text-left">التحكم</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {realProjects.map(p => (
              <tr key={p.id} className="group hover:bg-slate-800/50 transition-all">
                <td className="p-6 font-bold text-slate-200">{p.title_ar}</td>
                <td className="p-6 text-center text-slate-400">{p.city_ar || "غير محدد"}</td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black ${p.status_ar === 'نشط' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{p.status_ar === 'نشط' ? 'منشور' : 'معلق'}</span>
                </td>
                <td className="p-6 text-left">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => updateStatus(p.id, 'نشط')} className="p-2 bg-slate-800 text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"><FiCheck /></button>
                    <button onClick={() => updateStatus(p.id, 'معلق')} className="p-2 bg-slate-800 text-rose-400 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"><FiX /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}