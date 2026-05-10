"use client";

import React, { useEffect, useState } from "react";
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

// --- Interfaces ---
interface StatItem {
  id: number;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  sub: string;
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
  status: 'success' | 'pending';
}

interface ChartDataItem {
  name: string;
  value: number;
}

interface Project {
  id: string;
  title_ar: string;
  created_at: string;
  status_ar: string;
  city_ar: string | null;
  property_type_ar: string | null;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [realProjects, setRealProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. جلب عدد المستخدمين (استخدام as any لتخطي خطأ الـ never role)
      const { count: usersCount } = await (supabase
        .from('profiles') as any)
        .select('*', { count: 'exact', head: true });

      // 2. جلب المشاريع
      const { data, error: projectsError } = await (supabase
        .from('projects') as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      const projects = (data as Project[]) || [];

      // 3. معالجة الإحصائيات
      const totalProps = projects.length;
      const pendingProps = projects.filter(p => 
        p.status_ar === 'معلق' || p.status_ar === 'pending' || !p.status_ar
      ).length;
      
      setStats([
        { id: 1, label: "إجمالي المستخدمين", value: (usersCount || 0).toLocaleString("ar-SA"), icon: <FiUsers />, color: "bg-blue-600", sub: "عضو مسجل" },
        { id: 2, label: "العقارات المدرجة", value: totalProps.toLocaleString("ar-SA"), icon: <FiHome />, color: "bg-indigo-600", sub: "عقار نشط" },
        { id: 3, label: "بانتظار المراجعة", value: pendingProps.toLocaleString("ar-SA"), icon: <FiClock />, color: "bg-amber-500", sub: "طلبات معلقة" },
        { id: 4, label: "أداء المنصة", value: "٩٤٪", icon: <FiTrendingUp />, color: "bg-emerald-500", sub: "نسبة نمو مستقرة" },
      ]);

      // 4. الرسم البياني
      const cityGroups = projects.reduce((acc: Record<string, number>, curr: Project) => {
        const city = curr.city_ar || "أخرى";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const formattedChartData = Object.keys(cityGroups).map(city => ({
        name: city,
        value: cityGroups[city]
      })).slice(0, 5);

      setChartData(formattedChartData.length > 0 ? formattedChartData : [{name: 'لا بيانات', value: 0}]);
      setRealProjects(projects.slice(0, 6));

      // 5. النشاطات
      setRecentActivities(projects.slice(0, 5).map(p => ({
        id: p.id,
        text: `مشروع جديد: ${p.title_ar || 'بدون عنوان'}`,
        time: new Date(p.created_at).toLocaleDateString("ar-SA"),
        status: p.status_ar === 'نشط' ? 'success' : 'pending'
      })));

    } catch (error: any) {
      toast.error("حدث خطأ في مزامنة البيانات");
      console.error("Dashboard Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await (supabase
        .from('projects') as any)
        .update({ status_ar: newStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`تم تحديث الحالة لـ ${newStatus}`);
      fetchAllData(); 
    } catch (error: any) {
      toast.error("فشل التحديث: " + error.message);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg"
        />
        <p className="text-slate-400 font-bold animate-pulse">جاري جلب البيانات من سوبابيز...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 lg:p-12 font-sans" dir="rtl">
      <Toaster position="top-center" />
      
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
             لوحة التحكم الإدارية <FiActivity className="text-blue-600 text-2xl" />
          </h1>
          <p className="text-slate-400 font-medium mt-2">مرحباً بكِ، إليكِ حالة المنصة الحالية.</p>
        </motion.div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input type="text" placeholder="بحث..." className="bg-slate-900 border-none text-white shadow-sm ring-1 ring-slate-800 pr-12 pl-6 py-3.5 rounded-2xl w-full md:w-80 outline-none" />
          </div>
          <button className="w-12 h-12 bg-slate-900 shadow-sm ring-1 ring-slate-800 rounded-2xl flex items-center justify-center">
            <FiBell className="text-slate-600" />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((item, index) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
            className="bg-slate-900 p-6 rounded-[28px] shadow-sm border border-slate-800 hover:shadow-md transition-all group"
          >
            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-3xl font-black text-white">{item.value}</h3>
            <p className="text-slate-400 font-bold text-xs uppercase mt-1">{item.label}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold">{item.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 p-8 rounded-[35px] border border-slate-800 shadow-sm">
          <h3 className="text-xl font-black text-white mb-8">توزيع العقارات حسب المدن</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderRadius: '15px', border: 'none'}} />
                <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[35px] border border-slate-800 shadow-sm flex flex-col">
          <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <FiClock className="text-blue-600" /> آخر النشاطات
          </h3>
          <div className="space-y-6 flex-1">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-4 items-start p-3 hover:bg-slate-800/50 rounded-2xl transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${act.status === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
                <div>
                  <p className="text-[14px] text-slate-200 font-bold leading-tight">{act.text}</p>
                  <span className="text-[11px] font-semibold text-slate-400 mt-1 block">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-8 bg-slate-900 rounded-[35px] border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-2xl font-black text-white">إدارة المشاريع</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800">
                <th className="p-6 font-black">المشروع</th>
                <th className="p-6 font-black text-center">المدينة</th>
                <th className="p-6 font-black text-center">الحالة</th>
                <th className="p-6 font-black text-left">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {realProjects.map((project) => (
                <tr key={project.id} className="group hover:bg-slate-800/50 transition-all">
                  <td className="p-6 font-bold text-slate-200">{project.title_ar || "بدون اسم"}</td>
                  <td className="p-6 text-center text-slate-400">{project.city_ar || "غير محدد"}</td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${
                      project.status_ar === 'نشط' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {project.status_ar === 'نشط' ? 'منشور' : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="p-6 text-left">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => updateProjectStatus(project.id, 'نشط')} className="w-9 h-9 bg-slate-800 shadow-sm ring-1 ring-slate-700 text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><FiCheck /></button>
                      <button onClick={() => updateProjectStatus(project.id, 'معلق')} className="w-9 h-9 bg-slate-800 shadow-sm ring-1 ring-slate-700 text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><FiX /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}