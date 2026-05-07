"use client";

import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPlatformStats, 
  getAllUsers, 
  getCourses, 
  changeUserRole, 
  deleteCourse, 
  updateCourse,
  getPlatformSettings,
  updatePlatformSettings,
  useAddCourse
} from "@/queries";
import { User, Course, IProfessionalLMS } from "@/types";
import { useAppStore } from "@/store/useStore";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Users, BookOpen, DollarSign, Settings, LogOut, Search,
  Bell, ArrowUpRight, Activity, Moon, Sun, Menu, TrendingUp,
  RefreshCw, Trash2, UserPlus, Edit3, X, CreditCard, PieChart,
  Plus, CheckCircle, Image as ImageIcon, GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations("admin");
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. التحقق من الصلاحيات
  useEffect(() => {
    if (authStatus === "unauthenticated" || (session && session.user.role !== "admin")) {
      router.push(`/${locale}/auth/login`);
    }
  }, [session, authStatus, router, locale]);

  // 2. Queries
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: getPlatformStats,
    enabled: authStatus === "authenticated",
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["admin", "users"],
    queryFn: getAllUsers,
    enabled: authStatus === "authenticated",
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["admin", "courses"],
    queryFn: async () => {
      const data = await getCourses();
      return data as unknown as Course[];
    },
    enabled: authStatus === "authenticated",
  });

  // 3. Mutations
  const { mutate: handleUpdateCourse, isPending: isUpdatingCourse } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      setEditingCourse(null);
    },
  });

  const { mutate: addNewCourse, isPending: isAddingCourse } = useAddCourse();

  const handleAddCourse = (newCourse: any) => {
    addNewCourse(newCourse, {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success(locale === "ar" ? "تم إضافة الكورس بنجاح!" : "Course added successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      },
      onError: () => {
        toast.error(locale === "ar" ? "فشل في إضافة الكورس" : "Failed to add course");
      }
    });
  };

  const { mutate: updateRole, isPending: isUpdatingRole } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: User["role"] }) => 
      changeUserRole(userId, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });

  const { mutate: removeCourse } = useMutation({
    mutationFn: (courseId: string) => deleteCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });

  // 4. Filtering
  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  if (statsLoading || usersLoading || coursesLoading || authStatus === "loading") {
    return <AdminLoading darkMode={darkMode} t={t} />;
  }

  return (
    <div 
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "flex min-h-screen transition-colors duration-500 font-sans",
        darkMode ? "bg-[#0b0f1a] text-slate-200" : "bg-slate-50 text-slate-900",
        locale === "ar" ? "font-ghala" : "font-sans"
      )}
    >
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        darkMode={darkMode} 
        t={t} 
        locale={locale}
      />

      <main className={cn("flex-1 p-4 md:p-8 transition-all", locale === "en" ? "lg:ml-72" : "lg:mr-72")}>
        <AdminHeader 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          setSidebarOpen={setSidebarOpen} 
          user={session?.user} 
          t={t} 
          setSearchQuery={setSearchQuery} 
        />

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  <AdminStatCard title={t("totalUsers")} value={users.length} icon={Users} trend="+12.5%" color="text-blue-500" />
                  <AdminStatCard title={t("totalStudents")} value={stats?.totalStudents || 0} icon={Users} trend="+8.2%" color="text-emerald-500" />
                  <AdminStatCard title={t("totalCourses")} value={stats?.totalCourses || 0} icon={BookOpen} trend="+5.1%" color="text-purple-500" />
                  <AdminStatCard title={t("revenue")} value={`$${stats?.totalRevenue || 0}`} icon={DollarSign} trend="+14%" color="text-orange-500" />
                </div>
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                  <RecentUsersCard users={users} darkMode={darkMode} updateRole={updateRole} isUpdating={isUpdatingRole} t={t} />
                  <CourseApprovalsCard courses={courses} darkMode={darkMode} locale={locale} onDelete={removeCourse} t={t} />
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div key="users" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <UserListTable users={filteredUsers} darkMode={darkMode} updateRole={updateRole} t={t} />
              </motion.div>
            )}

            {activeTab === "courses" && (
              <motion.div key="courses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl italic font-black tracking-tighter uppercase">{t("courses")}</h2>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 font-black text-white transition-all bg-blue-600 shadow-xl rounded-2xl hover:bg-blue-700 hover:scale-105"
                  >
                    <Plus size={20}/> {locale === "ar" ? "إضافة كورس جديد" : "Add New Course"}
                  </button>
                </div>
                <AdminCourseGrid courses={courses} darkMode={darkMode} locale={locale} onDelete={removeCourse} onEdit={setEditingCourse} t={t} />
              </motion.div>
            )}

            {activeTab === "finances" && (
              <motion.div key="finances" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <AdminFinances stats={stats} darkMode={darkMode} t={t} />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <AdminSettings darkMode={darkMode} t={t} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {editingCourse && (
          <EditCourseModal 
            course={editingCourse} 
            onClose={() => setEditingCourse(null)} 
            onSave={(data: any) => handleUpdateCourse({ id: editingCourse.id, data })}
            isPending={isUpdatingCourse}
            darkMode={darkMode}
            locale={locale}
            t={t}
          />
        )}
      </AnimatePresence>

      <AddCourseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        darkMode={darkMode} 
        onAdd={handleAddCourse}
        isPending={isAddingCourse}
        locale={locale} 
        t={t} 
      />
    </div>
  );
}


function AdminSettings({ darkMode, t }: any) {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: getPlatformSettings,
  });

  const [platformName, setPlatformName] = useState("");

  useEffect(() => {
    if (settings) setPlatformName(settings.platformName);
  }, [settings]);

  const { mutate: handleUpdate, isPending } = useMutation({
    mutationFn: updatePlatformSettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });

  if (isLoading) return <div className="p-10 font-black text-center animate-pulse">{t("loading")}...</div>;

  return (
    <div className={cn("p-8 rounded-[2.5rem] border transition-all", darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm")}>
      <h2 className="mb-8 text-3xl italic font-black uppercase">{t("system")} <span className="text-blue-500">{t("settings")}</span></h2>
      <div className="max-w-2xl space-y-6">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-500 mx-2">{t("platformName")}</label>
          <input 
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full p-4 mt-1 font-bold transition-all border outline-none bg-slate-500/5 border-slate-500/10 rounded-2xl focus:border-blue-500"
          />
        </div>

        <div className="space-y-3">
          {[
            { id: 'maintenanceMode', label: t("maintenanceMode"), value: settings?.maintenanceMode },
            { id: 'allowRegistrations', label: t("allowRegistrations"), value: settings?.allowRegistrations }
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-2xl border-slate-500/10 bg-slate-500/5">
              <span className="text-sm font-black uppercase">{item.label}</span>
              <button 
                disabled={isPending}
                onClick={() => handleUpdate({ [item.id]: !item.value })}
                className={cn("relative w-12 h-6 rounded-full transition-colors", item.value ? "bg-blue-600" : "bg-slate-500")}
              >
                <motion.div animate={{ x: item.value ? 24 : 4 }} className="absolute w-4 h-4 bg-white rounded-full shadow-sm top-1" />
              </button>
            </div>
          ))}
        </div>

        <button 
          disabled={isPending || platformName === settings?.platformName}
          onClick={() => handleUpdate({ platformName })}
          className="flex items-center gap-2 px-8 py-4 text-xs font-black text-white uppercase transition-all bg-blue-600 shadow-lg rounded-2xl hover:scale-105 active:scale-95 shadow-blue-500/40"
        >
          {isPending && <RefreshCw className="animate-spin" size={14} />}
          {t("saveAll")}
        </button>
      </div>
    </div>
  );
}

function EditCourseModal({ course, onClose, onSave, isPending, darkMode, locale, t }: any) {
  const [title, setTitle] = useState(course.title[locale] || "");
  const [price, setPrice] = useState(course.price);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className={cn("w-full max-w-lg p-8 rounded-[2.5rem] border shadow-2xl", darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl italic font-black uppercase">{t("edit")} <span className="text-blue-600">{t("course")}</span></h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-500/10"><X size={20}/></button>
        </div>
        <div className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-4 font-bold border outline-none bg-slate-500/5 border-slate-500/10 rounded-2xl focus:border-blue-500" placeholder={t("courseTitle")} />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-4 font-bold border outline-none bg-slate-500/5 border-slate-500/10 rounded-2xl focus:border-blue-500" placeholder={t("price")} />
          <button disabled={isPending} onClick={() => onSave({ ...course, title: { ...course.title, [locale]: title }, price })} className="w-full py-4 font-black text-white uppercase bg-blue-600 shadow-lg rounded-2xl">
            {isPending ? <RefreshCw className="mx-auto animate-spin" size={18}/> : t("saveChanges")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdminStatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <div className="p-6 rounded-[2.5rem] border bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={cn("p-4 rounded-2xl bg-slate-100 dark:bg-slate-900", color)}><Icon size={24} /></div>
        <div className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
          {trend} <ArrowUpRight size={12}/>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-4xl font-black tracking-tight">{value}</h3>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-500">{title}</p>
      </div>
    </div>
  );
}

function AdminLoading({ darkMode, t }: any) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center justify-center gap-4", darkMode ? "bg-[#0b0f1a]" : "bg-slate-50")}>
      <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 animate-pulse">{t("loadingCore") || "LOADING CORE..."}</p>
    </div>
  );
}

function RecentUsersCard({ users, darkMode, updateRole, isUpdating, t }: any) {
  return (
    <div className={cn("p-8 rounded-[2.5rem] border", darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm")}>
      <h2 className="flex items-center gap-3 mb-8 text-xl italic font-black uppercase">
        <Users className="text-blue-500" /> {t("recent")} <span className="text-blue-500">{t("users")}</span>
      </h2>
      <div className="space-y-4">
        {users.slice(0, 5).map((u: any) => (
          <div key={u.id} className="flex items-center justify-between p-4 transition-all border border-transparent rounded-2xl hover:bg-slate-500/5">
            <div className="flex items-center gap-4">
              <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-10 h-10 rounded-xl" alt="" />
              <div>
                <p className="text-sm font-black">{u.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">{u.role}</p>
              </div>
            </div>
            <select 
              disabled={isUpdating}
              onChange={(e) => updateRole({ userId: u.id, role: e.target.value })}
              value={u.role}
              className="text-[10px] font-black bg-slate-500/10 rounded-lg p-2 outline-none cursor-pointer"
            >
              <option value="student">{t("student")}</option>
              <option value="teacher">{t("teacher")}</option>
              <option value="admin">{t("admin")}</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminHeader({ darkMode, toggleDarkMode, setSidebarOpen, user, t, setSearchQuery }: any) {
  return (
    <header className={cn("flex justify-between items-center p-5 rounded-[2rem] border sticky top-4 z-40 backdrop-blur-xl transition-all", 
      darkMode ? "bg-slate-900/80 border-slate-800 shadow-2xl" : "bg-white/80 border-slate-200 shadow-xl shadow-slate-200/50")}>
      <div className="flex items-center flex-1 gap-4">
        <button onClick={() => setSidebarOpen(true)} className="p-3 lg:hidden hover:bg-slate-500/10 rounded-xl"><Menu size={20}/></button>
        <div className="flex items-center w-full max-w-md gap-3 px-5 py-3 transition-all border border-transparent bg-slate-500/5 rounded-2xl focus-within:border-blue-500/50">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder={t("searchPlaceholder")} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-xs font-bold bg-transparent outline-none" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleDarkMode} className="p-3 transition-all rounded-xl bg-slate-500/5 hover:bg-slate-500/10">
          {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-blue-600" />}
        </button>
        <div className="flex items-center gap-3 px-4 border-l border-slate-500/20">
          <div className="hidden text-right md:block">
            <p className="text-xs font-black uppercase">{user?.name}</p>
            <p className="text-[9px] font-black text-blue-500 uppercase">{t("superAdmin")}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-600 p-0.5 shadow-lg shadow-blue-500/20">
             <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=0f172a&color=fff`} className="rounded-[0.55rem] w-full h-full object-cover" alt="avatar" />
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, darkMode, t, locale }: any) {
  const menuItems = [
    { id: "overview", icon: Activity, label: t("overview") },
    { id: "users", icon: Users, label: t("users") },
    { id: "courses", icon: BookOpen, label: t("courses") },
    { id: "finances", icon: DollarSign, label: t("finances") },
    { id: "settings", icon: Settings, label: t("settings") },
  ];

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden", sidebarOpen ? "block" : "hidden")} onClick={() => setSidebarOpen(false)} />
      <aside className={cn(
        "fixed inset-y-0 z-50 w-72 transform transition-transform duration-500 lg:translate-x-0 border-x",
        sidebarOpen ? "translate-x-0" : (locale === "en" ? "-translate-x-full" : "translate-x-full"),
        darkMode ? "bg-[#0b0f1a] border-slate-800" : "bg-white border-slate-200",
        locale === "en" ? "left-0" : "right-0"
      )}>
        <div className="flex items-center gap-4 p-8">
          <div className="p-3 text-white bg-blue-600 shadow-lg rounded-2xl shadow-blue-500/40 rotate-3"><ShieldCheck size={24} /></div>
          <h1 className="text-2xl italic font-black tracking-tighter uppercase">Admin<span className="text-blue-600">Core</span></h1>
        </div>
        <nav className="px-6 mt-6 space-y-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => {setActiveTab(item.id); setSidebarOpen(false);}}
              className={cn("w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black transition-all text-[13px] uppercase",
                activeTab === item.id ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30" : "text-slate-500 hover:bg-slate-500/5")}>
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute w-full px-6 bottom-8">
          <button onClick={() => signOut()} className="flex items-center w-full gap-4 px-5 py-4 text-xs font-black text-red-500 uppercase transition-all hover:bg-red-500/5 rounded-2xl">
            <LogOut size={18}/> {t("logout")}
          </button>
        </div>
      </aside>
    </>
  );
}

function CourseApprovalsCard({ courses, darkMode, locale, onDelete, t }: any) {
  return (
    <div className={cn("p-8 rounded-[2.5rem] border", darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm")}>
      <h2 className="flex items-center gap-3 mb-8 text-xl italic font-black uppercase">
        <BookOpen className="text-purple-500" /> {t("top")} <span className="text-purple-500">{t("courses")}</span>
      </h2>
      <div className="space-y-4">
        {courses.slice(0, 4).map((course: any) => (
          <div key={course.id} className="flex items-center justify-between p-4 border rounded-[1.5rem] border-slate-500/10 bg-slate-500/5">
            <div className="flex items-center min-w-0 gap-4">
              <img src={course.image} className="object-cover w-12 h-12 rounded-xl" alt="" />
              <div className="truncate">
                <p className="text-sm font-black truncate">{course.title[locale]}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase">${course.price}</p>
              </div>
            </div>
            <button onClick={() => onDelete(course.id)} className="p-2 text-red-500 transition-colors rounded-lg bg-red-500/10 hover:bg-red-500/20"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function UserListTable({ users, darkMode, updateRole, t }: any) {
  return (
    <div className={cn("p-8 rounded-[2.5rem] border", darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm")}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl italic font-black uppercase">{t("member")} <span className="text-blue-500">{t("directory")}</span></h2>
        <button className="flex items-center gap-2 px-6 py-3 text-xs font-black text-white uppercase bg-blue-600 shadow-lg rounded-2xl shadow-blue-500/30"><UserPlus size={16}/> {t("addUser")}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-500/10">
              <th className="px-4 pb-4">{t("member")}</th>
              <th className="pb-4">{t("roleStatus")}</th>
              <th className="pb-4">{t("email")}</th>
              <th className="px-4 pb-4 text-right">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-500/10">
            {users.map((u: any) => (
              <tr key={u.id} className="transition-colors hover:bg-slate-500/5">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${u.name}`} className="rounded-full w-9 h-9" alt="" />
                    <span className="text-sm font-black">{u.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <select 
                    onChange={(e) => updateRole({ userId: u.id, role: e.target.value })}
                    value={u.role}
                    className="bg-transparent border border-slate-500/20 rounded-lg p-1 text-[10px] font-black uppercase outline-none"
                  >
                    <option value="student">{t("student")}</option>
                    <option value="teacher">{t("teacher")}</option>
                    <option value="admin">{t("admin")}</option>
                  </select>
                </td>
                <td className="py-4 text-xs font-bold text-slate-500">{u.email}</td>
                <td className="px-4 py-4 text-right">
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCourseGrid({ courses, darkMode, locale, onDelete, onEdit, t }: any) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((c: any) => (
        <div key={c.id} className={cn("p-6 rounded-[2.5rem] border transition-all hover:scale-[1.02]", darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm")}>
          <div className="relative h-40 mb-4 overflow-hidden rounded-2xl bg-slate-100">
            <img src={c.image} className="object-cover w-full h-full" alt="" />
          </div>
          <h4 className="text-lg font-black truncate">{c.title[locale]}</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">{t("instructor")}: {c.teacher[locale]}</p>
          <div className="flex gap-2 pt-4 border-t border-slate-500/10">
            <button onClick={() => onEdit(c)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-500/10 rounded-xl text-[10px] font-black uppercase hover:text-blue-500 transition-colors">
              <Edit3 size={14}/> {t("edit")}
            </button>
            <button onClick={() => onDelete(c.id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/20 transition-colors">
              <Trash2 size={14}/> {t("delete")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminFinances({ stats, darkMode, t }: any) {
  return (
    <div className="space-y-8">
      <div className={cn("p-8 rounded-[2.5rem] border", darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm")}>
        <h2 className="mb-8 text-3xl italic font-black uppercase">{t("financial")} <span className="text-emerald-500">{t("analytics")}</span></h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FinanceCard icon={PieChart} color="text-emerald-500" label={t("grossRevenue")} value={`$${stats?.totalRevenue || 0}`} />
          <FinanceCard icon={CreditCard} color="text-blue-500" label={t("totalSubscriptions")} value={stats?.totalStudents || 0} />
          <FinanceCard icon={Activity} color="text-purple-500" label={t("avgOrderValue")} value={`$${stats?.totalRevenue && stats?.totalStudents ? (stats.totalRevenue / stats.totalStudents).toFixed(2) : 0}`} />
        </div>
      </div>
    </div>
  );
}

function FinanceCard({ icon: Icon, color, label, value }: any) {
  return (
    <div className="p-6 border rounded-3xl border-slate-500/10 bg-slate-500/5">
      <Icon className={cn("mb-4", color)} size={32} />
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  );
}

function AddCourseModal({ isOpen, onClose, darkMode, onAdd, isPending, locale, t }: any) {
  const { data: session } = useSession();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const titleVal = formData.get("title") as string;
    const descVal = formData.get("description") as string;
    const subjectVal = formData.get("subject") as string;
    const categoryVal = formData.get("category") as string;
    const levelVal = formData.get("level") as string;

    const newCourse: Partial<IProfessionalLMS> = {
      teacherId: session?.user?.id,
      title: { en: locale === "en" ? titleVal : "New Course", ar: locale === "ar" ? titleVal : "كورس جديد" },
      description: { en: locale === "en" ? descVal : "", ar: locale === "ar" ? descVal : "" },
      subject: { en: locale === "en" ? subjectVal : "Subject", ar: locale === "ar" ? subjectVal : "المادة" },
      category: { en: locale === "en" ? categoryVal : "Technology", ar: locale === "ar" ? categoryVal : "تكنولوجيا" },
      price: Number(formData.get("price")),
      level: { 
        en: levelVal, 
        ar: levelVal === "Beginner" ? "مبتدئ" : levelVal === "Intermediate" ? "متوسط" : "متقدم" 
      },
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      duration: { en: "0 hours", ar: "0 ساعة" },
      teacher: { en: session?.user?.name || "Admin", ar: session?.user?.name || "مسؤول" },
      teacherImage: session?.user?.image || "https://i.pravatar.cc/150",
      createdAt: Date.now(),
      rating: 5,
      lessons: [],
      enrollments: []
    };

    onAdd(newCourse);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0b0f1a]/90 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn("w-full max-w-2xl p-8 rounded-[2.5rem] border shadow-2xl overflow-y-auto max-h-[90vh]", darkMode ? "bg-[#111827] border-slate-800 text-white" : "bg-white border-slate-200")}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl italic font-black uppercase">{locale === "ar" ? "إضافة كورس" : "Add Course"}</h2>
          <button onClick={onClose} className="p-2 hover:text-red-500"><X/></button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2"><InputField label="Title" name="title" required /></div>
          <InputField label="Subject" name="subject" required />
          <InputField label="Category" name="category" required />
          <InputField label="Price ($)" name="price" type="number" required />
          <div className="flex flex-col space-y-2">
            <label className="text-[10px] font-black uppercase opacity-50 ml-2">Level</label>
            <select name="level" className="w-full p-4 text-sm font-bold transition-all border outline-none appearance-none rounded-2xl bg-slate-500/5 border-slate-500/10 focus:border-blue-500">
                <option value="Beginner">Beginner / مبتدئ</option>
                <option value="Intermediate">Intermediate / متوسط</option>
                <option value="Advanced">Advanced / متقدم</option>
            </select>
          </div>
          <div className="md:col-span-2"><TextAreaField label="Description" name="description" required /></div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isPending} className="flex items-center justify-center w-full gap-3 py-5 font-black text-white bg-blue-600 rounded-2xl">
              {isPending ? <RefreshCw className="animate-spin" /> : <CheckCircle size={20}/>}
              {isPending ? "Saving..." : "Create Course"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function InputField({ label, icon, className, ...props }: any) {
  return (
    <div className="w-full space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-4 text-slate-400">{icon}</div>}
        <input 
          {...props} 
          className={cn(
            "w-full p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10 outline-none focus:border-blue-500 font-bold text-sm transition-all", 
            icon && "pl-12",
            className
          )} 
        />
      </div>
    </div>
  );
}

function TextAreaField({ label, ...props }: any) {
  return (
    <div className="w-full space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">{label}</label>
      <textarea {...props} rows={3} className="w-full p-4 text-sm font-bold transition-all border outline-none resize-none rounded-2xl bg-slate-500/5 border-slate-500/10 focus:border-blue-500" />
    </div>
  );
}