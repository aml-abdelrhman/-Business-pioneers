# ============================================================
# .env.local — Environment Variables for Auth System
# ============================================================

# ── Supabase ─────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here   # ⚠️ server-only

# ── NextAuth ─────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here_min_32_chars          # openssl rand -base64 32

# ── Google OAuth ─────────────────────────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
# Authorized redirect URI in Google Console:
# http://localhost:3000/api/auth/callback/google
# https://yourdomain.com/api/auth/callback/google


# ============================================================
# AUTH SYSTEM — README
# ============================================================
#
# FILE STRUCTURE
# ──────────────
# src/
# ├── auth.ts                                ← NextAuth core config
# ├── middleware.ts                          ← Route protection
# ├── app/
# │   ├── api/auth/[...nextauth]/route.ts    ← NextAuth route handler
# │   └── [locale]/auth/
# │       ├── login/page.tsx                 ← Login page (3 role tabs)
# │       ├── register/page.tsx              ← Register page
# │       ├── forgot-password/page.tsx       ← Forgot password
# │       ├── reset-password/page.tsx        ← Reset password
# │       ├── error/page.tsx                 ← Auth error page
# │       ├── unauthorized/page.tsx          ← 403 page
# │       └── welcome/page.tsx               ← New user welcome
# ├── actions/
# │   └── auth.actions.ts                    ← Server Actions
# ├── hooks/
# │   └── useAuth.ts                         ← Client hooks
# └── components/auth/
#     ├── SessionProvider.tsx                ← NextAuth SessionProvider
#     └── RoleGuard.tsx                      ← Role-based rendering
#
#
# ROLES
# ─────
#   user       → عميل  — browse, favorite, contact agents
#   agent      → وكيل  — publish/manage properties, respond to inquiries
#   developer  → مطور  — same as agent + developer profile
#   admin      → أدمن  — full system access
#
#
# USAGE EXAMPLES
# ──────────────
#
# 1. Server Component — require auth:
#    const session = await requireAuth();
#
# 2. Server Component — require role:
#    const session = await requireRole(["admin"]);
#    const session = await requireRole(["agent", "developer", "admin"]);
#
# 3. Server Component — check role without redirect:
#    const canDelete = await hasRole(["admin"]);
#
# 4. Client Component — get current user:
#    const { user, isAuthenticated, isAdmin } = useAuth();
#
# 5. Client Component — protect page:
#    const { user } = useRequireAuth();             // any auth user
#    const { user } = useRequireRole(["admin"]);    // admin only
#    const { user } = useAdminGuard();              // shorthand
#    const { user } = useStaffGuard();              // agent/dev/admin
#
# 6. Declarative guards (JSX):
#    <AuthGuard>      <SecretContent />  </AuthGuard>
#    <AdminGuard>     <AdminPanel />     </AdminGuard>
#    <StaffGuard>     <Dashboard />      </StaffGuard>
#    <GuestGuard>     <LoginPage />      </GuestGuard>
#
# 7. Conditional rendering:
#    <ShowForRole roles={["admin"]}>      <DeleteBtn />  </ShowForRole>
#    <HideForRole roles={["admin"]}>      <UpgradeAd />  </HideForRole>
#    <ShowIfAuth>                         <Profile />    </ShowIfAuth>
#    <ShowIfGuest>                        <LoginLink />  </ShowIfGuest>
#
# 8. Admin: create staff account:
#    await createStaffAccountAction(prevState, formData);
#
# 9. Admin: toggle user active:
#    await toggleUserStatusAction(userId);
#
# 10. Admin: change user role:
#    await changeUserRoleAction(userId, "agent");
#
#
# SETUP STEPS
# ───────────
# 1. npm install next-auth@beta @auth/supabase-adapter zod
# 2. Copy .env.local variables
# 3. Run SQL: supabase_auth_trigger.sql  (handle_new_user trigger)
# 4. Add <SessionProvider> to src/app/[locale]/layout.tsx
# 5. Re-export handlers in src/app/api/auth/[...nextauth]/route.ts