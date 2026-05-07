"use client";
import React from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

const SessionProvider = ({ children }: PropsWithChildren) => {
  return (
    <NextAuthSessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
