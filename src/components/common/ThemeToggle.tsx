"use client";

import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useStore";

export const ThemeToggle = () => {
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  return (
    <Button
      variant="ghost"
      onClick={toggleDarkMode}
      className="text-lg p-2 rounded-full transition-colors hover:bg-white/10"
    >
      {darkMode ? '🌙' : '☀️'}
    </Button>
  );
};
