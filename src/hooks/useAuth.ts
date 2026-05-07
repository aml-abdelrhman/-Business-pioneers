// ============================================================
// src/hooks/useAuth.ts — Client-side Auth Hooks
// Built on top of next-auth/react useSession
// ============================================================

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter }           from "next/navigation";
import { useEffect }           from "react";
import type { UserRole }       from "@/types/database";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id:          string;
  name:        string | null;
  email:       string | null;
  image:       string | null;
  avatar_url:  string | null;
  phone:       string | null;
  role:        UserRole;
  is_verified: boolean;
  is_active:   boolean;
}

export interface UseAuthReturn {
  user:            AuthUser | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  isAdmin:         boolean;
  isAgent:         boolean;
  isDeveloper:     boolean;
  isStaff:         boolean;  // agent | developer | admin
  role:            UserRole | null;
  logout:          () => Promise<void>;
  hasRole:         (roles: UserRole[]) => boolean;
}

// ─────────────────────────────────────────────────────────────
// useAuth — main hook, safe to use anywhere in the app
// ─────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const isLoading       = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;
  const user            = isAuthenticated ? (session.user as AuthUser) : null;
  const role            = user?.role ?? null;

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const hasRole = (roles: UserRole[]) =>
    !!role && roles.includes(role);

  return {
    user,
    isLoading,
    isAuthenticated,
    role,
    isAdmin:     role === "admin",
    isAgent:     role === "agent",
    isDeveloper: role === "developer",
    isStaff:     hasRole(["agent", "developer", "admin"]),
    logout,
    hasRole,
  };
}

// ─────────────────────────────────────────────────────────────
// useRequireAuth — redirects to login if not authenticated
// Use at the top of protected Client Component pages
// ─────────────────────────────────────────────────────────────

export function useRequireAuth(redirectTo = "/auth/login") {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`${redirectTo}?callbackUrl=${window.location.pathname}`);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  return { user, isLoading };
}

// ─────────────────────────────────────────────────────────────
// useRequireRole — redirects if user doesn't have required role
// ─────────────────────────────────────────────────────────────

export function useRequireRole(
  allowedRoles: UserRole[],
  redirectTo = "/auth/unauthorized"
) {
  const { isAuthenticated, isLoading, user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/auth/login?callbackUrl=${window.location.pathname}`);
      return;
    }
    if (role && !allowedRoles.includes(role)) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, role, router, redirectTo]);

  return { user, isLoading };
}

// ─────────────────────────────────────────────────────────────
// useAdminGuard — shorthand for admin-only pages
// ─────────────────────────────────────────────────────────────

export function useAdminGuard() {
  return useRequireRole(["admin"]);
}

// ─────────────────────────────────────────────────────────────
// useStaffGuard — agent | developer | admin pages
// ─────────────────────────────────────────────────────────────

export function useStaffGuard() {
  return useRequireRole(["agent", "developer", "admin"]);
}