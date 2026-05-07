// components/ui/LoadingButton.tsx
"use client";

import React from "react";
import clsx from "clsx";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, children, className, ...props }) => {
  return (
    <button
      {...props}
      className={clsx(
        "relative flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition-colors",
        className
      )}
      disabled={loading || props.disabled}
    >
      {loading && (
        <span className="absolute w-4 h-4 border-2 border-white rounded-full left-4 border-t-transparent animate-spin"></span>
      )}
      <span className={clsx(loading && "opacity-50")}>{children}</span>
    </button>
  );
};

export default LoadingButton;