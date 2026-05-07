"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseQueryOptions, enrollCourse } from "@/queries";
import { useAppStore } from "@/store/useStore";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";
import { 
  CreditCard, 
  ShieldCheck, 
  ChevronLeft, 
  Lock, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function PaymentPage() {
  const { id } = useParams();
  const locale = useLocale() as "en" | "ar";
  const t = useTranslations();
  const router = useRouter();
  const darkMode = useAppStore((state) => state.darkMode);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // جلب بيانات الكورس للتأكد من السعر والعنوان
  const { data: course, isLoading } = useQuery(courseQueryOptions(id as string));

  // Mutation لعملية الاشتراك
  const mutation = useMutation({
    mutationFn: () => enrollCourse(session?.user?.id as string, course as any),
    onSuccess: () => {
      toast.success(t("Successfully Enrolled!"), {
        duration: 4000,
        icon: '🎉',
      });
      queryClient.invalidateQueries({ queryKey: ["user", session?.user?.id] });
      setTimeout(() => router.push(`/${locale}/dashboard/student`), 2000);
    },
    onError: (error: any) => {
      toast.error(error.message || t("Enrollment failed"));
    },
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div></div>;

  return (
    <div className={clsx(
      "min-h-screen py-12 transition-colors duration-500",
      darkMode ? "bg-[#0f172a] text-slate-100" : "bg-[#f8fafc] text-slate-900"
    )}>
      <Toaster position="top-center" />
      
      <div className="container max-w-5xl px-6 mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 font-bold transition-colors text-slate-500 hover:text-purple-600"
        >
          <ChevronLeft size={20} className={locale === 'ar' ? "rotate-180" : ""} />
          {t("Back to Course")}
        </button>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left Side: Payment Form */}
          <div className="space-y-8 lg:col-span-2">
            <div className={clsx(
              "p-8 border rounded-[2.5rem] shadow-xl transition-all",
              darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100"
            )}>
              <h2 className="flex items-center gap-3 mb-8 text-2xl font-black">
                <CreditCard className="text-purple-600" />
                {t("Payment Method")}
              </h2>

              {/* Fake Credit Card Form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold tracking-wider uppercase text-slate-400">{t("Card Number")}</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="**** **** **** 1234"
                      className={clsx(
                        "w-full p-4 pl-12 rounded-2xl border transition-all focus:ring-2 focus:ring-purple-600 outline-none",
                        darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
                      )}
                    />
                    <Lock className="absolute -translate-y-1/2 left-4 top-1/2 text-slate-400" size={18} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wider uppercase text-slate-400">{t("Expiry Date")}</label>
                    <input type="text" placeholder="MM/YY" className={clsx("w-full p-4 rounded-2xl border", darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold tracking-wider uppercase text-slate-400">CVV</label>
                    <input type="text" placeholder="***" className={clsx("w-full p-4 rounded-2xl border", darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200")} />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-4 mt-10 text-blue-500 border rounded-2xl bg-blue-500/10 border-blue-500/20">
                <ShieldCheck className="shrink-0" />
                <p className="text-sm font-medium">{t("Your payment information is encrypted and secure.")}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className={clsx(
              "sticky top-8 p-8 border rounded-[2.5rem] shadow-2xl space-y-6",
              darkMode ? "bg-slate-900 border-slate-800 shadow-purple-900/10" : "bg-white border-slate-100"
            )}>
              <h3 className="text-xl font-black">{t("Order Summary")}</h3>
              
              <div className="flex gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <img src={course?.image} className="object-cover w-20 h-20 rounded-2xl" alt="" />
                <div>
                  <h4 className="font-bold leading-tight">{course?.title[locale]}</h4>
                  <p className="mt-1 text-sm text-slate-400">{course?.teacher[locale]}</p>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">{t("Price")}</span>
                  <span>${course?.price}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400">{t("Tax")}</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between pt-4 text-2xl font-black border-t border-slate-100 dark:border-slate-800">
                  <span>{t("Total")}</span>
                  <span className="text-purple-600">${course?.price}</span>
                </div>
              </div>

              <button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className={clsx(
                  "w-full py-5 rounded-2xl font-black text-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                  mutation.isPending 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/30 text-white"
                )}
              >
                {mutation.isPending ? (
                  <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={22} />
                    {t("Confirm Payment")}
                  </>
                )}
              </button>

              <p className="px-4 text-xs leading-relaxed text-center text-slate-400">
                {t("By clicking confirm, you agree to our Terms of Service.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}