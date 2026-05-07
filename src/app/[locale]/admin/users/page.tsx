"use client";

// ============================================================

// src/app/[locale]/admin/users/page.tsx — Users Management

// ============================================================



import { useState, useTransition }  from "react";

import { motion }                   from "framer-motion";

import { useLocale }                from "next-intl";

import { cn }                       from "@/lib/utils";

import { useAppStore }              from "@/store/useStore";

import {

  toggleUserStatusAction,

  changeUserRoleAction,

  createStaffAccountAction,

} from "@/actions/auth.actions";

import { Button }   from "@/components/ui/button";

import { Input }    from "@/components/ui/input";

import { Badge }    from "@/components/ui/badge";

import {

  Users, Search, Plus, Filter,

  MoreVertical, ShieldCheck, ShieldOff,

  UserCog, Trash2, Mail, Phone,

  CheckCircle2, XCircle, Clock,

  ChevronLeft, ChevronRight, X,

  Loader2, Eye,

} from "lucide-react";

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuSeparator,

  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";

import type { UserRole } from "@/types/database";



// ─── Mock Data (replace with TanStack Query fetch) ────────────

const MOCK_USERS = [

  { id: "u1", full_name: "أحمد محمد الشمري",  email: "ahmed@example.com",  phone: "0501234567", role: "user"      as UserRole, is_active: true,  is_verified: true,  created_at: "2025-01-15", avatar_url: null },

  { id: "u2", full_name: "سارة عبدالله العمري",email: "sara@example.com",   phone: "0559876543", role: "agent"     as UserRole, is_active: true,  is_verified: true,  created_at: "2025-02-03", avatar_url: null },

  { id: "u3", full_name: "خالد إبراهيم الراشد",email: "khaled@example.com", phone: "0534567890", role: "developer" as UserRole, is_active: true,  is_verified: false, created_at: "2025-03-20", avatar_url: null },

  { id: "u4", full_name: "فاطمة حسن القحطاني", email: "fatima@example.com", phone: "0512345678", role: "user"      as UserRole, is_active: false, is_verified: true,  created_at: "2025-04-10", avatar_url: null },

  { id: "u5", full_name: "محمد سالم الزهراني", email: "msalem@example.com", phone: "0567891234", role: "agent"     as UserRole, is_active: true,  is_verified: true,  created_at: "2025-04-22", avatar_url: null },

  { id: "u6", full_name: "نورة علي المطيري",   email: "noura@example.com",  phone: "0523456789", role: "user"      as UserRole, is_active: true,  is_verified: false, created_at: "2025-05-01", avatar_url: null },

];



const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string }> = {

  admin:     { label: "مدير",    color: "text-rose-500",   bg: "bg-rose-500/10"   },

  agent:     { label: "وكيل",   color: "text-amber-600",  bg: "bg-amber-500/10"  },

  developer: { label: "مطور",   color: "text-purple-500", bg: "bg-purple-500/10" },

  user:      { label: "عميل",   color: "text-blue-600",   bg: "bg-blue-500/10"   },

};



const FILTER_ROLES = [

  { label: "الكل",       value: "all"       },

  { label: "عملاء",     value: "user"      },

  { label: "وكلاء",     value: "agent"     },

  { label: "مطورون",    value: "developer" },

  { label: "مدراء",     value: "admin"     },

];



// ─── Create Staff Modal ───────────────────────────────────────

function CreateStaffModal({

  darkMode, onClose,

}: { darkMode: boolean; onClose: () => void }) {

  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);



  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    startTransition(async () => {

      const res = await createStaffAccountAction({ success: false, message: "" }, fd);

      setResult(res);

      if (res.success) setTimeout(onClose, 1500);

    });

  }



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div

        initial={{ opacity: 0, scale: 0.95, y: 20 }}

        animate={{ opacity: 1, scale: 1, y: 0 }}

        exit={{ opacity: 0, scale: 0.95 }}

        className={cn(

          "relative w-full max-w-md rounded-2xl border p-6 shadow-2xl z-10",

          darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"

        )}

      >

        {/* Header */}

        <div className="flex items-center justify-between mb-5">

          <h3 className={cn("text-base font-black", darkMode ? "text-white" : "text-slate-900")}>

            إضافة موظف جديد

          </h3>

          <button onClick={onClose} className={cn("w-7 h-7 rounded-lg flex items-center justify-center", darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>

            <X size={15} />

          </button>

        </div>



        {/* Feedback */}

        {result && (

          <div className={cn(

            "flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4 text-sm",

            result.success ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"

          )}>

            {result.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}

            {result.message}

          </div>

        )}



        <form onSubmit={handleSubmit} className="space-y-3">

          {[

            { name: "full_name", label: "الاسم الكامل",          type: "text",     placeholder: "محمد أحمد" },

            { name: "email",     label: "البريد الإلكتروني",     type: "email",    placeholder: "staff@rawad.com" },

            { name: "phone",     label: "رقم الجوال",            type: "tel",      placeholder: "05xxxxxxxx" },

            { name: "password",  label: "كلمة المرور المؤقتة",   type: "password", placeholder: "Rawad@2026" },

            { name: "confirm_password", label: "تأكيد كلمة المرور", type: "password", placeholder: "Rawad@2026" },

          ].map(f => (

            <div key={f.name} className="space-y-1">

              <label className={cn("text-xs font-semibold", darkMode ? "text-slate-300" : "text-slate-700")}>{f.label}</label>

              <Input

                name={f.name} type={f.type} placeholder={f.placeholder} required

                className={cn("rounded-xl h-9 text-sm", darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200")}

              />

            </div>

          ))}



          <div className="space-y-1">

            <label className={cn("text-xs font-semibold", darkMode ? "text-slate-300" : "text-slate-700")}>الدور الوظيفي</label>

            <select

              name="role"

              required

              className={cn("w-full rounded-xl h-9 px-3 text-sm border outline-none", darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200 text-slate-800")}

            >

              <option value="agent">وكيل عقاري</option>

              <option value="developer">مطور عقاري</option>

              <option value="admin">مدير نظام</option>

            </select>

          </div>



          <div className="flex gap-2 pt-1">

            <Button type="button" variant="outline" onClick={onClose} className={cn("flex-1 rounded-xl h-9 text-sm", darkMode ? "border-slate-700 text-slate-300" : "")}>

              إلغاء

            </Button>

            <Button

              type="submit" disabled={isPending}

              className="flex-1 gap-2 text-sm font-bold text-white h-9 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700"

            >

              {isPending ? <Loader2 size={14} className="animate-spin" /> : null}

              إنشاء الحساب

            </Button>

          </div>

        </form>

      </motion.div>

    </div>

  );

}



// ─── User Row ─────────────────────────────────────────────────

function UserRow({

  user, darkMode, onToggleStatus, onChangeRole,

}: {

  user: typeof MOCK_USERS[0];

  darkMode: boolean;

  onToggleStatus: (id: string) => void;

  onChangeRole: (id: string, role: UserRole) => void;

}) {

  const roleConf = ROLE_CONFIG[user.role];

  const initials = user.full_name.split(" ").slice(0, 2).map(w => w[0]).join("");



  return (

    <motion.tr

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}

      className={cn(

        "border-b transition-colors",

        darkMode ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-100 hover:bg-slate-50"

      )}

    >

      {/* User */}

      <td className="px-4 py-3">

        <div className="flex items-center gap-3">

          <div className={cn(

            "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0",

            user.is_active

              ? "bg-gradient-to-br from-blue-900 to-blue-700 text-white"

              : darkMode ? "bg-slate-700 text-slate-500" : "bg-slate-200 text-slate-400"

          )}>

            {initials}

          </div>

          <div>

            <p className={cn("text-sm font-bold", darkMode ? "text-white" : "text-slate-900")}>

              {user.full_name}

            </p>

            <p className={cn("text-xs", darkMode ? "text-slate-500" : "text-slate-400")}>

              {user.email}

            </p>

          </div>

        </div>

      </td>



      {/* Phone */}

      <td className="hidden px-4 py-3 md:table-cell">

        <span className={cn("text-xs", darkMode ? "text-slate-400" : "text-slate-600")} dir="ltr">

          {user.phone}

        </span>

      </td>



      {/* Role */}

      <td className="px-4 py-3">

        <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", roleConf.bg, roleConf.color)}>

          {roleConf.label}

        </span>

      </td>



      {/* Status */}

      <td className="hidden px-4 py-3 sm:table-cell">

        {user.is_active ? (

          <span className="flex items-center gap-1.5 text-xs text-emerald-600">

            <CheckCircle2 size={12} /> نشط

          </span>

        ) : (

          <span className="flex items-center gap-1.5 text-xs text-slate-400">

            <XCircle size={12} /> موقوف

          </span>

        )}

      </td>



      {/* Verified */}

      <td className="hidden px-4 py-3 lg:table-cell">

        {user.is_verified ? (

          <span className="flex items-center gap-1.5 text-xs text-blue-500">

            <ShieldCheck size={12} /> موثق

          </span>

        ) : (

          <span className="flex items-center gap-1.5 text-xs text-slate-400">

            <Clock size={12} /> غير موثق

          </span>

        )}

      </td>



      {/* Date */}

      <td className="hidden px-4 py-3 xl:table-cell">

        <span className={cn("text-xs", darkMode ? "text-slate-500" : "text-slate-400")}>

          {new Date(user.created_at).toLocaleDateString("ar-SA")}

        </span>

      </td>



      {/* Actions */}

      <td className="px-4 py-3">

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button variant="ghost" size="icon"

              className={cn("w-8 h-8 rounded-lg", darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100")}>

              <MoreVertical size={15} />

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent

            align="end"

            className={cn("min-w-[160px] rounded-xl border shadow-xl p-1",

              darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"

            )}

          >

            <DropdownMenuItem className={cn("rounded-lg text-xs cursor-pointer gap-2",

              darkMode ? "text-slate-300 hover:bg-slate-700" : "hover:bg-slate-50")}>

              <Eye size={13} /> عرض التفاصيل

            </DropdownMenuItem>



            <DropdownMenuSeparator className={darkMode ? "bg-slate-700" : "bg-slate-100"} />



            {/* Change role submenu */}

            {(["agent", "developer", "admin", "user"] as UserRole[]).filter(r => r !== user.role).map(r => (

              <DropdownMenuItem

                key={r}

                onClick={() => onChangeRole(user.id, r)}

                className={cn("rounded-lg text-xs cursor-pointer gap-2",

                  darkMode ? "text-slate-300 hover:bg-slate-700" : "hover:bg-slate-50")}>

                <UserCog size={13} />

                تحويل إلى {ROLE_CONFIG[r].label}

              </DropdownMenuItem>

            ))}



            <DropdownMenuSeparator className={darkMode ? "bg-slate-700" : "bg-slate-100"} />



            <DropdownMenuItem

              onClick={() => onToggleStatus(user.id)}

              className={cn("rounded-lg text-xs cursor-pointer gap-2",

                user.is_active ? "text-rose-500 hover:bg-rose-500/10" : "text-emerald-500 hover:bg-emerald-500/10"

              )}

            >

              {user.is_active

                ? <><ShieldOff size={13} /> إيقاف الحساب</>

                : <><ShieldCheck size={13} /> تفعيل الحساب</>

              }

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </td>

    </motion.tr>

  );

}



// ─── Main Page ────────────────────────────────────────────────

export default function AdminUsersPage() {

  const { darkMode } = useAppStore();

  const locale       = useLocale();

  const isRTL        = locale === "ar";



  const [users,        setUsers]        = useState(MOCK_USERS);

  const [search,       setSearch]       = useState("");

  const [roleFilter,   setRoleFilter]   = useState("all");

  const [showModal,    setShowModal]    = useState(false);

  const [isPending,    startTransition] = useTransition();

  const [currentPage,  setCurrentPage]  = useState(1);

  const PER_PAGE = 10;



  // Filter

  const filtered = users.filter(u => {

    const matchSearch = !search ||

      u.full_name.includes(search) ||

      u.email.includes(search) ||

      u.phone.includes(search);

    const matchRole = roleFilter === "all" || u.role === roleFilter;

    return matchSearch && matchRole;

  });



  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const paginated  = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);



  // Handlers

  function handleToggleStatus(id: string) {

    startTransition(async () => {

      await toggleUserStatusAction(id);

      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));

    });

  }



  function handleChangeRole(id: string, role: UserRole) {

    startTransition(async () => {

      await changeUserRoleAction(id, role);

      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));

    });

  }



  // Summary counts

  const counts = {

    total:     users.length,

    active:    users.filter(u => u.is_active).length,

    agents:    users.filter(u => u.role === "agent" || u.role === "developer").length,

    unverified:users.filter(u => !u.is_verified).length,

  };



  return (

    <div dir={isRTL ? "rtl" : "ltr"} className="space-y-5">



      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className={cn("text-xl font-black", darkMode ? "text-white" : "text-slate-900")}>

            إدارة المستخدمين

          </h1>

          <p className={cn("text-sm mt-0.5", darkMode ? "text-slate-400" : "text-slate-500")}>

            {counts.total} مستخدم مسجل

          </p>

        </div>

        <Button

          onClick={() => setShowModal(true)}

          className="gap-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-blue-900 to-blue-700"

        >

          <Plus size={15} />

          إضافة موظف

        </Button>

      </div>



      {/* Summary cards */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

        {[

          { label: "إجمالي",     value: counts.total,      color: "blue"  },

          { label: "نشطون",      value: counts.active,     color: "green" },

          { label: "موظفون",     value: counts.agents,     color: "amber" },

          { label: "غير موثقين", value: counts.unverified, color: "rose"  },

        ].map((c, i) => (

          <div key={i} className={cn(

            "rounded-xl border p-4 text-center",

            darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"

          )}>

            <div className={cn("text-2xl font-black mb-0.5",

              c.color === "blue"  ? darkMode ? "text-blue-400"    : "text-blue-900"  :

              c.color === "green" ? "text-emerald-500" :

              c.color === "amber" ? "text-amber-500"   : "text-rose-500"

            )}>

              {c.value}

            </div>

            <div className={cn("text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>{c.label}</div>

          </div>

        ))}

      </div>



      {/* Filters */}

      <div className={cn(

        "rounded-2xl border p-4 flex flex-col sm:flex-row gap-3",

        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"

      )}>

        {/* Search */}

        <div className="relative flex-1">

          <Search size={14} className={cn("absolute top-1/2 -translate-y-1/2 pointer-events-none",

            isRTL ? "right-3" : "left-3",

            darkMode ? "text-slate-500" : "text-slate-400")} />

          <Input

            value={search}

            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}

            placeholder="ابحث باسم أو إيميل أو جوال..."

            className={cn("rounded-xl h-9 text-sm",

              isRTL ? "pr-9" : "pl-9",

              darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200")}

          />

        </div>



        {/* Role filter */}

        <div className="flex gap-1.5 flex-wrap">

          {FILTER_ROLES.map(r => (

            <button

              key={r.value}

              onClick={() => { setRoleFilter(r.value); setCurrentPage(1); }}

              className={cn(

                "text-xs font-bold px-3 py-2 rounded-xl transition-all",

                roleFilter === r.value

                  ? "bg-blue-900 text-white shadow"

                  : darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"

              )}

            >

              {r.label}

            </button>

          ))}

        </div>

      </div>



      {/* Table */}

      <div className={cn(

        "rounded-2xl border overflow-hidden",

        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"

      )}>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className={cn("border-b text-xs font-bold",

                darkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500")}>

                <th className="px-4 py-3 text-start">المستخدم</th>

                <th className="hidden px-4 py-3 text-start md:table-cell">الجوال</th>

                <th className="px-4 py-3 text-start">الدور</th>

                <th className="hidden px-4 py-3 text-start sm:table-cell">الحالة</th>

                <th className="hidden px-4 py-3 text-start lg:table-cell">التوثيق</th>

                <th className="hidden px-4 py-3 text-start xl:table-cell">تاريخ التسجيل</th>

                <th className="px-4 py-3 text-start">إجراءات</th>

              </tr>

            </thead>

            <tbody>

              {paginated.length > 0 ? paginated.map(user => (

                <UserRow

                  key={user.id}

                  user={user}

                  darkMode={darkMode}

                  onToggleStatus={handleToggleStatus}

                  onChangeRole={handleChangeRole}

                />

              )) : (

                <tr>

                  <td colSpan={7} className="px-4 py-12 text-center">

                    <Users size={32} className={cn("mx-auto mb-2", darkMode ? "text-slate-700" : "text-slate-300")} />

                    <p className={cn("text-sm", darkMode ? "text-slate-500" : "text-slate-400")}>

                      لا توجد نتائج

                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>



        {/* Pagination */}

        {totalPages > 1 && (

          <div className={cn("flex items-center justify-between px-4 py-3 border-t text-xs",

            darkMode ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500")}>

            <span>

              عرض {Math.min((currentPage - 1) * PER_PAGE + 1, filtered.length)}–

              {Math.min(currentPage * PER_PAGE, filtered.length)} من {filtered.length}

            </span>

            <div className="flex items-center gap-1">

              <Button variant="outline" size="icon"

                disabled={currentPage === 1}

                onClick={() => setCurrentPage(p => p - 1)}

                className={cn("w-7 h-7 rounded-lg", darkMode ? "border-slate-700" : "")}>

                {isRTL ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}

              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (

                <button key={p} onClick={() => setCurrentPage(p)}

                  className={cn("w-7 h-7 rounded-lg text-xs font-bold transition-all",

                    p === currentPage

                      ? "bg-blue-900 text-white"

                      : darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600"

                  )}>

                  {p}

                </button>

              ))}

              <Button variant="outline" size="icon"

                disabled={currentPage === totalPages}

                onClick={() => setCurrentPage(p => p + 1)}

                className={cn("w-7 h-7 rounded-lg", darkMode ? "border-slate-700" : "")}>

                {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}

              </Button>

            </div>

          </div>

        )}

      </div>



      {/* Create staff modal */}

      {showModal && (

        <CreateStaffModal darkMode={darkMode} onClose={() => setShowModal(false)} />

      )}

    </div>

  );

}