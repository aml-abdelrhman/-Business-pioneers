// ============================================================
// src/actions/auth.actions.ts
// ============================================================

"use server";

import { signIn, signOut, auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { Database, UserRole } from "@/types/database";

// ── Supabase Admin ────────────────────────────────────────────
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── Helper: جيب الـ role من profiles عن طريق الـ email ────────
// profiles مفيهاش email، فبنجيب الـ id من auth.users أولاً
async function getRoleByEmail(email: string): Promise<UserRole> {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000, // كافي للغالبية
    });

    if (error || !data?.users) return "user";

    const authUser = data.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!authUser) return "user";

    const { data: profile } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", authUser.id)
      .maybeSingle();

    return (profile?.role ?? "user") as UserRole;
  } catch {
    return "user";
  }
}

// ── Types ─────────────────────────────────────────────────────
export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// ── Zod Schemas ───────────────────────────────────────────────
const LoginSchema = z.object({
  email:    z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

const RegisterSchema = z
  .object({
    full_name:        z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
    email:            z.string().email("البريد الإلكتروني غير صالح"),
    phone:            z
      .string()
      .regex(/^\d{10,15}$/, "رقم الجوال غير صالح")
      .optional()
      .or(z.literal("")),
    password:         z.string().min(8, "كلمة المرور 8 أحرف على الأقل"),
    confirm_password: z.string(),
    role:             z.enum(["user", "agent", "developer"]).default("user"),
    agree_terms:      z.literal(true, { message: "يجب الموافقة على الشروط" }),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirm_password"],
  });

// ── Role → Home Page ──────────────────────────────────────────
const ROLE_HOME: Record<UserRole, string> = {
  user:      "/profile",
  agent:     "/dashboard",
  developer: "/dashboard",
  admin:     "/admin",
};

// ── Login Action ──────────────────────────────────────────────
export async function loginAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = (formData.get("locale") as string) || "ar";
  const callbackUrl = formData.get("callbackUrl") as string | null;

  const parsed = LoginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return {
      success: false,
      message: "بيانات غير صالحة",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  let destination = `/${locale}/profile`; // افتراضي

  try {
    // 1. تحديد الوجهة بناءً على الـ Role
    const role = await getRoleByEmail(parsed.data.email);
    
    if (callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.includes("/auth/")) {
      destination = callbackUrl;
    } else {
      destination = `/${locale}${ROLE_HOME[role]}`;
    }

    // 2. محاولة تسجيل الدخول
    const result = await signIn("credentials", {
      email:    parsed.data.email,
      password: parsed.data.password,
      redirect: false, // نتحكم في التوجيه يدوياً لتجنب الصفحة البيضاء
    });

    if (result?.error) {
       return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }

  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) throw error;
    return { success: false, message: "حدث خطأ غير متوقع" };
  }

  // 3. تحديث الكاش والتوجيه (خارج الـ try/catch)
  // revalidatePath تضمن مسح الكاش القديم للـ Session قبل الانتقال للصفحة الجديدة
  revalidatePath("/", "layout");
  redirect(destination);
}

// ── Google Login ──────────────────────────────────────────────
export async function loginWithGoogle(callbackUrl?: string) {
  try {
    await signIn("google", {
      redirectTo: callbackUrl && callbackUrl !== "/" ? callbackUrl : undefined,
    });
  } catch (error: any) {
    if (
      error?.message === "NEXT_REDIRECT" ||
      error?.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("Google Login Error:", error);
  }
}

// ── Logout ────────────────────────────────────────────────────
export async function logoutAction() {
  await signOut({ redirect: false });
  revalidatePath("/", "layout");
  redirect("/");
}

// ── Register ──────────────────────────────────────────────────
export async function registerAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const locale = (formData.get("locale") as string) || "ar";

  const raw = {
    full_name:        formData.get("full_name"),
    email:            formData.get("email"),
    phone:            formData.get("phone") || "",
    password:         formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    role:             formData.get("role") || "user",
    agree_terms:      formData.get("agree_terms") === "true" ? true : undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "بيانات غير صالحة",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // 1. إنشاء الأكاونت في Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email:         parsed.data.email,
      password:      parsed.data.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.data.full_name },
    });

  if (authError || !authData?.user) {
    if (authError?.message?.includes("already registered")) {
      return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" };
    }
    return { success: false, message: "حدث خطأ أثناء إنشاء الحساب" };
  }

  // 2. إنشاء الـ profile
  const { error: profileError } = await (supabase.from("profiles") as any).insert([
    {
      id:          authData.user.id,
      full_name:   parsed.data.full_name,
      phone:       parsed.data.phone || null,
      role:        parsed.data.role,
      is_active:   true,
      is_verified: true,
      avatar_url:  null,
    },
  ]);

  if (profileError) {
    await supabase.auth.admin.deleteUser(authData.user.id);
    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء الحساب، حاول مرة أخرى",
    };
  }

  redirect(`/${locale}/auth/login?registered=true`);
}

// ── Admin: Toggle User Status ─────────────────────────────────
export async function toggleUserStatusAction(
  userId: string
): Promise<ActionResult> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "غير مصرح" };
  }

  const { data: profile } = await (supabase.from("profiles") as any)
    .select("is_active, full_name")
    .eq("id", userId)
    .single();

  if (!profile) return { success: false, message: "المستخدم غير موجود" };

  const { error } = await (supabase.from("profiles") as any)
    .update({ is_active: !profile.is_active })
    .eq("id", userId);

  if (error) return { success: false, message: "حدث خطأ أثناء التحديث" };

  revalidatePath("/admin/users");
  return {
    success: true,
    message: `تم ${!profile.is_active ? "تفعيل" : "تعطيل"} حساب ${profile.full_name}`,
  };
}

// ── Admin: Change User Role ───────────────────────────────────
export async function changeUserRoleAction(
  userId: string,
  newRole: UserRole
): Promise<ActionResult> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "غير مصرح" };
  }

  const validRoles: UserRole[] = ["user", "agent", "developer", "admin"];
  if (!validRoles.includes(newRole)) {
    return { success: false, message: "دور غير صالح" };
  }

  const { error } = await (supabase.from("profiles") as any)
    .update({ role: newRole })
    .eq("id", userId);

  if (error) return { success: false, message: "حدث خطأ أثناء التحديث" };

  revalidatePath("/admin/users");
  return { success: true, message: "تم تحديث الصلاحية بنجاح" };
}