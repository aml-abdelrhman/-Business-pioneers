"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ChevronRight, ChevronLeft, Home, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { courseQueryOptions } from "@/queries"; 

const BreadcrumbBar = () => {
  const t = useTranslations("breadcrumb");
  const locale = useLocale() as "en" | "ar";
  const pathname = usePathname();
  const isAr = locale === "ar";

  const allSegments = useMemo(() => 
    pathname.split("/").filter((p) => p && p !== "en" && p !== "ar"),
    [pathname]
  );

  const courseId = allSegments[0] === "courses" && allSegments[1] ? allSegments[1] : null;

  const { data: course, isLoading } = useQuery({
    ...courseQueryOptions(courseId as string),
    enabled: !!courseId,
  });

  const courseName = useMemo(() => {
    if (!course?.title) return null;
    return course.title[locale] || course.title["en"];
  }, [course, locale]);

  const breadcrumbs = useMemo(() => {
    return allSegments.map((seg, index) => {
      const path = `/${locale}/${allSegments.slice(0, index + 1).join("/")}`;
      const isIdSegment = seg === courseId;
      
      let label = seg;

      if (isIdSegment) {
        label = courseName || (isLoading ? "..." : seg);
      } else {
        try {
          label = t.has(seg) ? t(seg) : seg.replace(/-/g, " ");
        } catch {
          label = seg.replace(/-/g, " ");
        }
      }

      return { label, path, isId: isIdSegment };
    });
  }, [allSegments, locale, t, courseName, courseId, isLoading]);

  if (allSegments.length === 0) return null;

  return (
    <nav className="flex items-center w-full px-5 py-4 mt-20 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-slate-200 dark:border-slate-800 md:px-16">
      <ol className="flex flex-wrap items-center gap-2 text-sm font-medium">
        <li>
          <Link href={`/${locale}`} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-900 transition-colors">
            <Home size={16} />
            <span className="hidden sm:block">{t("home")}</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              <span className="text-slate-300 dark:text-slate-700">
                {isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </span>

              {isLast ? (
                <span className="flex items-center gap-2 font-bold text-blue-900 capitalize dark:text-amber-500">
                  {crumb.isId && isLoading && <Loader2 size={12} className="animate-spin" />}
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.path} className="capitalize transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbBar;