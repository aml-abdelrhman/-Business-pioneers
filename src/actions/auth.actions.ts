// ============================================================
// src/actions/auth.actions.ts — Auth Server Actions
// register | login | logout | forgotPassword | resetPassword
// updateProfile | changePassword | deleteAccount
// ============================================================

"use server";

import { signIn, signOut, auth } from "@/auth";
import { createClient }          from "@supabase/supabase-js";
import { revalidatePath }        from "next/cache";
import { redirect }              from "next/navigation";
import { z }                     from "zod";
import type { Database, UserRole } from "@/types/database";

// ─── Supabase admin (bypasses RLS for server actions) ────────
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ─── Zod schemas ─────────────────────────────────────────────

const RegisterSchema = z.object({
  full_name: z.string().min(3,  "الاسم يجب أن يكون 3 حروف على الأقل"),
  email:     z.string().email("البريد الإلكتروني غير صالح"),
  phone:     z.string()
              .regex(/^\d{10,15}$/, "رقم الجوال يجب أن يكون بين 10 إلى 15 رقماً")
              .optional()
              .or(z.literal("")),
  password:  z.string()
              .min(8, "كلمة المرور 8 أحرف على الأقل")
              .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
              .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
  confirm_password: z.string(),
  role:      z.enum(["user", "agent", "developer"]).default("user"),
  agree_terms: z.literal(true, { message: "يجب الموافقة على الشروط" }),
}).refine(d => d.password === d.confirm_password, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirm_password"],
});

const LoginSchema = z.object({
  email:    z.string().email("البريد الإلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

const ForgotSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

const ResetSchema = z.object({
  password: z.string()
             .min(8, "كلمة المرور 8 أحرف على الأقل")
             .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير")
             .regex(/[0-9]/, "يجب أن تحتوي على رقم"),
  confirm_password: z.string(),
  token: z.string().min(1),
}).refine(d => d.password === d.confirm_password, {
  message: "كلمتا المرور غير متطابقتين",
  path: ["confirm_password"],
});

const UpdateProfileSchema = z.object({
  full_name:      z.string().min(3),
  full_name_en:   z.string().optional(),
  phone:          z.string().optional(),
  avatar_url:     z.string().url().optional().or(z.literal("")),
  preferred_lang: z.enum(["ar", "en"]).default("ar"),
  dark_mode:      z.boolean().default(false),
});

// ─── Response type ────────────────────────────────────────────
export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?:   T;
  errors?: Record<string, string[]>;
}

// ─── Register ─────────────────────────────────────────────────
export async function registerAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    full_name:        formData.get("full_name"),
    email:            formData.get("email"),
    phone:            formData.get("phone"),
    password:         formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    role:             formData.get("role") ?? "user",
    agree_terms:      formData.get("agree_terms") === "on" ? true : undefined,
  };
  const locale = formData.get("locale") as string || "ar";

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "يوجد أخطاء في البيانات المدخلة",
      errors:  parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { full_name, email, phone, password, role } = parsed.data;

  // Create Supabase Auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false, // will send confirmation email
    user_metadata: { full_name, phone, role },
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { success: false, message: "البريد الإلكتروني مسجل مسبقاً" };
    }
    return { success: false, message: "حدث خطأ أثناء إنشاء الحساب" };
  }

  // Create profile row (trigger handles this, but upsert as fallback)
  const { error: profileError } = await (supabase.from("profiles") as any).upsert([{
    id:        authData.user!.id,
    full_name,
    phone:     (phone as string) || null,
    role:      role as UserRole,
    is_active: true,
  }]);

  if (profileError) {
    // Rollback: delete auth user
    await supabase.auth.admin.deleteUser(authData.user!.id);
    return { success: false, message: "حدث خطأ أثناء حفظ البيانات" };
  }

  // Send confirmation email
  await supabase.auth.admin.generateLink({
    type:  "signup",
    email,
    password, // تم إضافة كلمة المرور هنا لحل خطأ TypeScript
    options: { redirectTo: `${process.env.NEXTAUTH_URL}/${locale}/auth/verify-email` },
  });

  redirect(`/${locale}/auth/login`);
}

// ─── Login ────────────────────────────────────────────────────
export async function loginAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    email:    formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "بيانات غير صالحة",
      errors:  parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const locale = formData.get("locale") as string || "ar";
  let callbackUrl = formData.get("callbackUrl") as string | null;

  // التحقق مما إذا كان المستخدم يريد الصفحة الرئيسية فعلياً أو لم يحدد مساراً
  const isDefaultHome = !callbackUrl || callbackUrl === "/" || callbackUrl === `/${locale}`;

  // التأكد من أن callbackUrl يحتوي على اللوكيل إذا كان مساراً داخلياً ولا يبدأ بلوكيل
  if (callbackUrl && callbackUrl.startsWith("/") && !/^\/(ar|en)(\/|$)/.test(callbackUrl)) {
    callbackUrl = `/${locale}${callbackUrl === "/" ? "" : callbackUrl}`;
  }

  // تحديد المسار الافتراضي بناءً على الدور الحقيقي للمستخدم
  let targetPath = `/${locale}/profile`;

  try {
    // جلب بيانات المستخدم لمعرفة دوره يدوياً قبل تسجيل الدخول
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const userMatch = usersData?.users?.find(u => u.email?.toLowerCase() === parsed.data.email.toLowerCase());
    const userId = userMatch?.id;

    const { data: profile } = await (supabase.from("profiles") as any)
      .select("role")
      .eq("id", userId || "")
      .maybeSingle();

    const role = (profile?.role as UserRole) || "user";

    if (role === "admin") {
      targetPath = `/${locale}/admin`;
    } else if (role === "agent" || role === "developer") {
      targetPath = `/${locale}/dashboard`;
    }
  } catch (error) {
    console.error("Error fetching user role during login:", error);
  }

  let destination = isDefaultHome ? targetPath : callbackUrl!;

  try {
    // التحسين: استخدام توجيه NextAuth المدمج أو التأكد من إتمام العملية
    await signIn("credentials", { 
      email:       parsed.data.email,
      password:    parsed.data.password,
      redirect:    false, 
    });

    // مسح الكاش هنا بعد نجاح تسجيل الدخول لضمان أن النظام يرى الجلسة الجديدة
    revalidatePath("/", "layout"); 
    revalidatePath(`/${locale}`, "layout");
    revalidatePath(destination, "layout");

  } catch (error: any) {
    console.error("Auth.js Login Error Details:", {
      type: error?.type,
      name: error?.name,
      message: error?.message,
      cause: error?.cause?.err?.message // غالباً ما يحتوي هذا على رسالة Supabase الحقيقية
    });

    // يجب إعادة رمي أخطاء التوجيه لأن Next.js يستخدمها للانتقال بعد النجاح
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    // استخراج رسالة الخطأ الأصلية (نعطي الأولوية للخطأ الداخلي الممرر من authorize)
    const originalErrorMessage = error?.cause?.err?.message || error?.message;

    if (originalErrorMessage?.includes("Email not confirmed")) {
      return { success: false, message: "يرجى تأكيد بريدك الإلكتروني أولاً قبل تسجيل الدخول." };
    }
    if (originalErrorMessage?.includes("ACCOUNT_DISABLED")) {
      return { success: false, message: "حسابك موقوف. تواصل مع الدعم." };
    }
    // تجميع أخطاء تسجيل الدخول المعروفة في مكان واحد
    const errorType = error?.type || error?.name;
    if (errorType === "CredentialsSignin" || errorType === "CallbackRouteError") {
      return { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
    }

    return { success: false, message: "حدث خطأ غير متوقع أثناء تسجيل الدخول" };
  }

  // التوجيه يجب أن يكون دائماً خارج بلوك الـ try/catch لضمان عمله في Next.js
  redirect(destination);
}

// ─── Google Login ─────────────────────────────────────────────
export async function loginWithGoogle(callbackUrl?: string) {
  try {
    await signIn("google", { redirectTo: callbackUrl ?? "/" });
  } catch (error: any) {
    console.error("Google Login Error:", error);
    throw error; // إعادة رمي الخطأ للسماح لـ Next.js بالتعامل معه
  }
}

// ─── Logout ───────────────────────────────────────────────────
export async function logoutAction() {
  await signOut({ redirect: false }); // منع signOut من التوجيه تلقائياً
  revalidatePath("/", "layout"); // مسح الكاش للصفحة الرئيسية
  redirect("/"); // توجيه يدوي لضمان تحديث النيفبار
}

// ─── Forgot Password ──────────────────────────────────────────
export async function forgotPasswordAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw    = { email: formData.get("email") };
  const parsed = ForgotSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: "البريد الإلكتروني غير صالح",
      errors:  parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Check user exists (don't reveal if not found — security best practice)
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const userId = usersData?.users?.find(u => u.email?.toLowerCase() === parsed.data.email.toLowerCase())?.id;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId || "")
    .maybeSingle();

  // Always return success to prevent email enumeration
  await supabase.auth.admin.generateLink({
    type:  "recovery",
    email: parsed.data.email,
    options: { redirectTo: `${process.env.NEXTAUTH_URL}/auth/reset-password` },
  });

  return {
    success: true,
    message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
  };
}

// ─── Reset Password ───────────────────────────────────────────
export async function resetPasswordAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    password:         formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    token:            formData.get("token"),
  };

  const parsed = ResetSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "يوجد أخطاء في البيانات",
      errors:  parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Exchange token for session then update password
  const { data, error } = await supabase.auth.exchangeCodeForSession(parsed.data.token);
  if (error || !data.user) {
    return { success: false, message: "الرابط غير صالح أو منتهي الصلاحية" };
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(
    data.user.id,
    { password: parsed.data.password }
  );

  if (updateError) {
    return { success: false, message: "حدث خطأ أثناء تحديث كلمة المرور" };
  }

  return { success: true, message: "تم تحديث كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن." };
}

// ─── Update Profile ───────────────────────────────────────────
export async function updateProfileAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "يجب تسجيل الدخول أولاً" };
  }

  const raw = {
    full_name:      formData.get("full_name"),
    full_name_en:   formData.get("full_name_en"),
    phone:          formData.get("phone"),
    avatar_url:     formData.get("avatar_url"),
    preferred_lang: formData.get("preferred_lang") ?? "ar",
    dark_mode:      formData.get("dark_mode") === "true",
  };

  const parsed = UpdateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "يوجد أخطاء في البيانات",
      errors:  parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { error } = await (supabase.from("profiles") as any)
    .update(parsed.data)
    .eq("id", session.user.id);

  if (error) return { success: false, message: "فشل تحديث البيانات" };

  revalidatePath("/profile");
  return { success: true, message: "تم تحديث بياناتك بنجاح" };
}

// ─── Admin: Create Staff Account ──────────────────────────────
export async function createStaffAccountAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "غير مصرح" };
  }

  const parsed = RegisterSchema.omit({ agree_terms: true }).safeParse({
    full_name:        formData.get("full_name"),
    email:            formData.get("email"),
    phone:            formData.get("phone"),
    password:         formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    role:             formData.get("role") ?? "agent",
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "يوجد أخطاء في البيانات",
      errors:  parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { full_name, email, phone, password, role } = parsed.data;

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // staff accounts are pre-confirmed
    user_metadata: { full_name, phone, role },
  });

  if (authError) {
    return { success: false, message: authError.message };
  }

  await supabase.from("profiles").upsert([{
    id:           authData.user!.id,
    full_name,
    phone:        (phone as string) || null,
    role:         role as UserRole,
    is_verified:  true,
    is_active:    true,
  }] as any);

  revalidatePath("/admin/users");
  return {
    success: true,
    message: `تم إنشاء حساب ${full_name} بنجاح`,
    data:    { id: authData.user!.id },
  };
}

// ─── Admin: Toggle User Active Status ────────────────────────
export async function toggleUserStatusAction(userId: string): Promise<ActionResult> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "غير مصرح" };
  }

  const { data: profile } = await (supabase.from("profiles") as any)
    .select("is_active, full_name")
    .eq("id", userId)
    .single();

  if (!profile) return { success: false, message: "المستخدم غير موجود" };

  await (supabase.from("profiles") as any)
    .update({ is_active: !profile.is_active })
    .eq("id", userId);

  revalidatePath("/admin/users");
  return {
    success: true,
    message: `تم ${profile.is_active ? "إيقاف" : "تفعيل"} حساب ${profile.full_name}`,
  };
}

// ─── Admin: Change User Role ──────────────────────────────────
export async function changeUserRoleAction(
  userId: string,
  newRole: UserRole
): Promise<ActionResult> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, message: "غير مصرح" };
  }
  if (userId === session.user.id) {
    return { success: false, message: "لا يمكنك تغيير دورك بنفسك" };
  }

  const { error } = await (supabase.from("profiles") as any)
    .update({ role: newRole })
    .eq("id", userId);

  if (error) return { success: false, message: "فشل تغيير الدور" };

  revalidatePath("/admin/users");
  return { success: true, message: "تم تحديث الدور بنجاح" };
}