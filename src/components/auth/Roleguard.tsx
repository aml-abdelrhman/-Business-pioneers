"use client";
// ============================================================
// src/components/auth/RoleGuard.tsx
// Declarative role-based rendering for Client Components
// ============================================================

import { useAuth }         from "@/hooks/useAuth";
import { useRouter }       from "next/navigation";
import { useEffect }       from "react";
import { Loader2 }         from "lucide-react";
import { cn }              from "@/lib/utils";
import { useAppStore }     from "@/store/useStore";
import type { UserRole }   from "@/types/database";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface GuardProps {
  children:    React.ReactNode;
  fallback?:   React.ReactNode;    // shown while loading
  redirect?:   string;             // redirect instead of rendering fallback
  unauthorized?: React.ReactNode;  // shown when role doesn't match
}

// ─────────────────────────────────────────────────────────────
// Loading Spinner (used as default fallback)
// ─────────────────────────────────────────────────────────────

function LoadingSpinner() {
  const { darkMode } = useAppStore();
  return (
    <div className={cn(
      "min-h-[200px] flex items-center justify-center",
      darkMode ? "text-slate-400" : "text-slate-500"
    )}>
      <Loader2 size={28} className="animate-spin" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RoleGuard — show content only for specific roles
// ─────────────────────────────────────────────────────────────

interface RoleGuardProps extends GuardProps {
  allowedRoles: UserRole[];
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback      = <LoadingSpinner />,
  redirect,
  unauthorized  = null,
}: RoleGuardProps) {
  const { isLoading, isAuthenticated, hasRole } = useAuth();
  const router = useRouter();

  const allowed = hasRole(allowedRoles);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && redirect) {
      router.replace(`/auth/login?callbackUrl=${window.location.pathname}`);
    }
    if (isAuthenticated && !allowed && redirect) {
      router.replace(redirect);
    }
  }, [isLoading, isAuthenticated, allowed, redirect, router]);

  if (isLoading) return <>{fallback}</>;
  if (!isAuthenticated || !allowed) return <>{unauthorized}</>;
  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────
// AdminGuard — admin only
// ─────────────────────────────────────────────────────────────

export function AdminGuard({ children, ...props }: GuardProps) {
  return (
    <RoleGuard allowedRoles={["admin"]} {...props}>
      {children}
    </RoleGuard>
  );
}

// ─────────────────────────────────────────────────────────────
// StaffGuard — agent | developer | admin
// ─────────────────────────────────────────────────────────────

export function StaffGuard({ children, ...props }: GuardProps) {
  return (
    <RoleGuard allowedRoles={["agent", "developer", "admin"]} {...props}>
      {children}
    </RoleGuard>
  );
}

// ─────────────────────────────────────────────────────────────
// AuthGuard — any authenticated user
// ─────────────────────────────────────────────────────────────

export function AuthGuard({
  children,
  fallback    = <LoadingSpinner />,
  redirect    = "/auth/login",
  unauthorized = null,
}: GuardProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirect) {
      router.replace(`${redirect}?callbackUrl=${window.location.pathname}`);
    }
  }, [isLoading, isAuthenticated, redirect, router]);

  if (isLoading)       return <>{fallback}</>;
  if (!isAuthenticated) return <>{unauthorized}</>;
  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────
// GuestGuard — only for non-authenticated users (login / register pages)
// Redirects logged-in users away
// ─────────────────────────────────────────────────────────────

interface GuestGuardProps {
  children:  React.ReactNode;
  fallback?: React.ReactNode;
}

export function GuestGuard({ children, fallback = <LoadingSpinner /> }: GuestGuardProps) {
  const { isLoading, isAuthenticated, isAdmin, isStaff } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    // Redirect based on role
    if (isAdmin)  router.replace("/admin");
    else if (isStaff) router.replace("/dashboard");
    else          router.replace("/");
  }, [isLoading, isAuthenticated, isAdmin, isStaff, router]);

  if (isLoading || isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────
// ShowForRole — inline conditional rendering (no redirect)
// Great for toggling UI elements based on role
//
// Usage:
//   <ShowForRole roles={["admin"]}>
//     <DeleteButton />
//   </ShowForRole>
// ─────────────────────────────────────────────────────────────

interface ShowForRoleProps {
  roles:    UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ShowForRole({ roles, children, fallback = null }: ShowForRoleProps) {
  const { hasRole, isLoading } = useAuth();
  if (isLoading) return null;
  return hasRole(roles) ? <>{children}</> : <>{fallback}</>;
}

// ─────────────────────────────────────────────────────────────
// HideForRole — inverse of ShowForRole
// ─────────────────────────────────────────────────────────────

export function HideForRole({ roles, children }: Omit<ShowForRoleProps, "fallback">) {
  const { hasRole, isLoading } = useAuth();
  if (isLoading) return null;
  return !hasRole(roles) ? <>{children}</> : null;
}

// ─────────────────────────────────────────────────────────────
// ShowIfAuth — render only when authenticated
// ─────────────────────────────────────────────────────────────

export function ShowIfAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading || !isAuthenticated) return null;
  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────
// ShowIfGuest — render only when NOT authenticated
// ─────────────────────────────────────────────────────────────

export function ShowIfGuest({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading || isAuthenticated) return null;
  return <>{children}</>;
}