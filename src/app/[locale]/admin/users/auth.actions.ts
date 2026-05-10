"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@/types/database";

// Initialize Supabase Admin client (using Service Role Key for administrative tasks)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createStaffAccountAction(prevState: any, formData: FormData) {
  try {
    const fullName = formData.get("full_name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const role = formData.get("role") as UserRole;

    if (!fullName || !email || !password || !role) {
      return { success: false, errors: "جميع الحقول مطلوبة" };
    }

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role }
    });

    if (authError) throw authError;

    // 2. Update the profile record
    // We use upsert to ensure the profile exists with the correct role/metadata
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ 
        id: authData.user.id,
        full_name: fullName,
        email,
        role,
        is_active: true,
        is_verified: true 
      });

    if (profileError) throw profileError;

    revalidatePath("/admin/users");
    
    return { success: true };
  } catch (error: any) {
    console.error("Staff creation error:", error);
    return { 
      success: false, 
      errors: error.message || "حدث خطأ أثناء إنشاء الحساب" 
    };
  }
}

export async function toggleUserStatusAction(id: string) {
    // Implement status toggle logic here...
    return { success: true };
}

export async function changeUserRoleAction(id: string, role: UserRole) {
    // Implement role change logic here...
    return { success: true };
}