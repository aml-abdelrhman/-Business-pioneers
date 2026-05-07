import React from "react";
import { AlertCircle, FileX, Inbox, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

interface EmptyStateProps {
  type?: "search" | "data" | "error" | "general" | "loading";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  /** Controls skeleton layout when `type` is `loading` */
  variant?: "page" | "table" | "card";
  /** Rows to render for table skeleton */
  rows?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = "data",
  title,
  description,
  actionLabel,
  onAction,
  action,
  icon,
  className = "",
  variant = "page",
  rows = 6,
}) => {
  const t = useTranslations();

  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case "search":
        return {
          icon: <Search size={48} className="text-zinc-400" />,
          title: t("emptyState.search.title"),
          description: t("emptyState.search.description"),
        };
      case "data":
        return {
          icon: <Inbox size={48} className="text-zinc-400" />,
          title: t("emptyState.data.title"),
          description: t("emptyState.data.description"),
        };
      case "error":
        return {
          icon: <AlertCircle size={48} className="text-pink-600" />,
          title: t("emptyState.error.title"),
          description: t("emptyState.error.description"),
        };
      case "loading":
        return {
          icon: <Skeleton className="w-10 h-10 rounded-full" />,
          title: t("emptyState.loading.title"),
          description: t("emptyState.loading.description"),
        };
      default:
        return {
          icon: <FileX size={48} className="text-zinc-400" />,
          title: t("emptyState.general.title"),
          description: t("emptyState.general.description"),
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;
  const displayIcon = icon || defaultContent.icon;

  const renderLoadingSkeleton = () => {
    if (variant === "table") {
      return (
        <div className="w-full">
          {/* Table header skeleton */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
          </div>
          {/* Table rows skeleton */}
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-3 gap-4 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (variant === "card") {
      return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: Math.max(3, Math.min(6, rows)) }).map(
            (_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4"
              >
                <Skeleton className="h-36 rounded-xl mb-4" />
                <Skeleton className="h-5 mb-3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ),
          )}
        </div>
      );
    }

    // Default page skeleton
    return (
      <div className="w-full">
        <Skeleton className="h-7 w-2/3 sm:w-1/2 mx-auto mb-6" />
        <div className="space-y-3 max-w-3xl mx-auto">
          <Skeleton className="h-4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        `relative flex flex-col items-center justify-center rounded-2xl py-16 px-6 text-center overflow-hidden`,
        className,
      )}
    >
      {/* Background decoration */}
      <div className="relative mb-6">
        {/* Subtle background circle */}
        <div className="absolute inset-0 rounded-full bg-linear-to-br from-main-50 to-pink-50 opacity-50 scale-150" />
        {/* Icon container */}
        <div className="relative z-10 size-18 lg:size-24 mx-auto flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm">
          {displayIcon}
        </div>
      </div>
      {/* Title */}
      <h3 className="text-primary dark:text-main-100 text-2xl font-bold leading-8 tracking-tight my-3 max-w-md">
        {displayTitle}
      </h3>
      {/* Description */}
      <p className="text-center text-zinc-500 dark:text-zinc-400 text-base font-normal leading-6 mb-8 max-w-lg">
        {displayDescription}
      </p>

      {/* Loading skeletons */}
      {type === "loading" ? (
        <div className="w-full max-w-5xl">{renderLoadingSkeleton()}</div>
      ) : action ? (
        <div className="flex flex-col items-center gap-4">{action}</div>
      ) : actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="px-8 py-3 rounded-xl bg-main-700 text-white font-bold text-base transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
        >
          {actionLabel}
        </button>
      ) : null}

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-main-50 rounded-full blur-3xl opacity-30 -translate-y-12 translate-x-12 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-100 rounded-full blur-2xl opacity-20 translate-y-8 -translate-x-8 pointer-events-none" />
    </div>
  );
};

export default EmptyState;
