"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useStore";

export const useTheme = () => {
  const darkMode = useAppStore((state) => state.darkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [darkMode, mounted]);

  return { darkMode };
};
