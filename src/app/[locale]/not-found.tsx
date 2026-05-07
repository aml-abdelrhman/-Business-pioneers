"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import GridShape from "@/components/GridShape";

const NotFound = () => {
  const t = useTranslations("NotFound");
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80svh] p-6 overflow-hidden z-1">
      <GridShape />
      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-primary dark:text-white/90 xl:text-2xl">
          {t("title")}
        </h1>
        <Image src="/404.svg" alt="404" width={400} height={400} />
        <p className="mt-10 mb-6 text-base text-zinc-700 dark:text-zinc-400 sm:text-lg">
          {t("description")}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-3.5 text-sm font-medium text-zinc-700 shadow-theme-xs hover:bg-zinc-50 hover:text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-white/[0.03] dark:hover:text-zinc-200"
        >
          {t("homeButton")}
        </Link>
      </div>
      {/* <!-- Footer --> */}
      <p className="absolute text-sm text-center text-zinc-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} - Hemma
      </p>
    </div>
  );
};

export default NotFound;
