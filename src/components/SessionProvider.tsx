// src/components/auth/SessionProvider.tsx
"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";
import type { Session } from "next-auth";

// ← المهم: استقبل الـ session من الـ Server وبعتها للـ Provider
export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session:  Session | null;   // ← الإضافة دي
}) {
  return (
    <NextAuthProvider
      session={session}           // ← الإضافة دي
      refetchInterval={5 * 60}
      refetchOnWindowFocus
    >
      {children}
    </NextAuthProvider>
  );
}