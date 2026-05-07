import React from "react";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations, useLocale } from "next-intl";

interface ActionConfirmationDialogProps {
  title?: string;
  description?: string;
  action: () => void;
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

const ActionConfirmationDialog: React.FC<ActionConfirmationDialogProps> = ({
  title = "Are You sure",
  description = "This action can not be undone",
  action,
  children,
  asChild,
  className,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={asChild} className={className}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent
        className="p-6 sm:max-w-[480px] rounded-2xl border shadow-lg"
        aria-describedby="action-confirmation-description"
      >
        <AlertDialogHeader
          className="sm:text-start space-y-2"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center size-8 rounded-full bg-red-500/15 text-red-600 ring-1 ring-red-500/20">
              <AlertTriangle className="size-4" />
            </span>
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              {t(title)}
            </AlertDialogTitle>
          </div>
          {description && (
            <AlertDialogDescription
              id="action-confirmation-description"
              className="text-sm text-muted-foreground"
            >
              {t(description)}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:ltr:justify-end sm:rtl:justify-start gap-4">
          <AlertDialogCancel className="rounded-lg border bg-background text-brand-900 shadow-theme-xs transition-[background,transform,box-shadow] hover:bg-muted active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {t("Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className="inline-flex items-center justify-center rounded-lg bg-red-600 text-white px-4 py-2 shadow-theme-xs transition-[background,transform,box-shadow] hover:bg-red-700 active:scale-[.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 disabled:opacity-70"
            onClick={action}
          >
            {t("Confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ActionConfirmationDialog;
