import React from "react";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { Analytics } from "@vercel/analytics/next";
import { PropsWithChildren } from "react";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>
      {children}
      <Analytics />
    </SessionProvider>
  );
};

export default RootLayout;
