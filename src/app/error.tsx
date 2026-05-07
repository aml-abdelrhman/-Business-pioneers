"use client";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";


export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {

  return (
    <div className="min-h-dvh bg-linear-to-br from-main-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex justify-center">
          <div className="bg-main-100 p-3 rounded-full">
            <TriangleAlert className="w-12 h-12 text-main-800" />
          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-gray-900">
            حدث خطأ غير متوقع
          </h2>

          <p className="text-gray-600">تفاصيل الخطأ</p>

          <div className="bg-red-50 rounded-lg p-4 mt-4">
            <p className="text-sm font-mono text-red-600 break-all">
              {JSON.stringify(error, null, 2)}
              {error?.message}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <Button
            onClick={reset}
            startContent={<RefreshCw className="w-4 h-4" />}
            variant="outline"
          >
            إعادة المحاولة
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            startContent={<Home className="w-4 h-4" />}
          >
            الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
