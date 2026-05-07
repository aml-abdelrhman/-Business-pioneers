"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseQueryOptions, enrollCourse } from "@/queries";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useAppStore } from "@/store/useStore";
import clsx from "clsx";
import toast, { Toaster } from "react-hot-toast";
import { CreditCard, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Course } from "@/types";

export default function PaymentPage() {
  const { id } = useParams();
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const darkMode = useAppStore((state) => state.darkMode);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: course, isLoading } = useQuery(courseQueryOptions(id as string));

  const paymentMutation = useMutation({
    mutationFn: () => enrollCourse(session?.user?.id as string, course as Course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", session?.user?.id] });
      toast.success(t("Enrolled successfully") || "Payment Successful!");
      setTimeout(() => router.push(`/${locale}/dashboard`), 2000);
    },
    onError: () => toast.error("Payment failed. Please try again."),
  });

  if (isLoading || !course) return null;

  return (
    <div className={clsx("min-h-screen py-20 px-6", darkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-slate-900")}>
      <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
      
      <div className="container max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-8 font-bold opacity-70 hover:opacity-100">
          <ArrowLeft size={20} /> {t("breadcrumb.home")}
        </button>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Course Summary */}
          <div className={clsx("p-8 rounded-[2.5rem] h-fit", darkMode ? "bg-slate-900 border border-slate-800" : "bg-white shadow-xl")}>
            <h2 className="mb-6 text-2xl font-black">{t("Course_Details")}</h2>
            <div className="flex gap-4 mb-8">
              <img src={course.image} className="object-cover w-24 h-24 rounded-2xl" alt="Course" />
              <div>
                <h3 className="mb-1 text-xl font-bold">{course.title[locale as 'en' | 'ar']}</h3>
                <p className="text-sm text-slate-500">{course.teacher[locale as 'en' | 'ar'] as string}</p>
              </div>
            </div>
            
            <div className="pt-6 space-y-4 border-t border-dashed border-slate-200 dark:border-slate-700">
              <div className="flex justify-between font-medium">
                <span>{t("admin.price")}</span>
                <span>${course.price}</span>
              </div>
              <div className="flex justify-between font-medium text-green-500">
                <span>Discount</span>
                <span>-$0.00</span>
              </div>
              <div className="flex justify-between pt-4 text-2xl font-black">
                <span>Total</span>
                <span>${course.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className={clsx("p-10 rounded-[2.5rem]", darkMode ? "bg-slate-900 border border-slate-800" : "bg-white shadow-xl")}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 text-white bg-purple-600 rounded-2xl">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black">{t("admin.financial")}</h2>
            </div>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); paymentMutation.mutate(); }}>
              <div>
                <label className="block mb-2 text-sm font-bold opacity-70">Card Number</label>
                <input 
                  type="text" 
                  placeholder="**** **** **** ****" 
                  className={clsx("w-full p-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none", darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200")} 
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-bold opacity-70">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    className={clsx("w-full p-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none", darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200")} 
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-bold opacity-70">CVV</label>
                  <input 
                    type="password" 
                    placeholder="***" 
                    className={clsx("w-full p-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none", darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200")} 
                    required
                  />
                </div>
              </div>

              <button
                disabled={paymentMutation.isPending}
                className="flex items-center justify-center w-full gap-2 py-5 mt-4 text-xl font-black text-white transition-all shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl active:scale-95 disabled:opacity-50"
              >
                {paymentMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>Pay & Enroll Now</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-6 text-sm font-bold text-slate-500">
                <ShieldCheck size={18} className="text-green-500" />
                Secure & Encrypted Transaction
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}