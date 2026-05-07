// ============================================================
// src/components/auth/SessionProvider.tsx
// Wraps the app with NextAuth SessionProvider
// ============================================================
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      // Re-fetch session every 5 minutes to catch role changes
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}

