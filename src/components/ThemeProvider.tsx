"use client";

import { PropsWithChildren } from "react";
import { useTheme } from "@/hooks/useTheme";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  useTheme();
  return <>{children}</>;
};
