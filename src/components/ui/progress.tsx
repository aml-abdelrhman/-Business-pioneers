"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const locale = useLocale();
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-main-200 relative h-4 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-main-500 h-full w-full flex-1 transition-all rounded-full"
        style={{ transform: `translateX(${locale === "ar" ? "" : "-"}${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
