"use client";
import React, { useState, useRef } from "react";
import { supabase } from "@/lib/supabase"; 
import { z } from "zod";

// 0. تعريف مخطط التحقق الصارم
const jobSchema = z.object({
  full_name: z.string().min(3, "الاسم الكامل مطلوب (على الأقل ٣ أحرف)"),
  email: z.string()
    .trim()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "صيغة البريد الإلكتروني غير صحيحة"),
  phone: z.string()
    .regex(/^\+?[0-9]{8,15}$/, "رقم الهاتف يجب أن يكون بين ٨ إلى ١٥ رقماً فقط"),
  position: z.string().min(2, "يرجى تحديد الوظيفة المستهدفة"),
  message: z.string().optional(),
});

// 1. تعريف الهيكل لضمان توافق البيانات ومنع أخطاء TypeScript
interface JobApplication {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  message?: string;
  cv_url: string;
  cv_filename: string;
  is_general: boolean;
}

export default function JobApplicationForm() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    
    // التحقق من البيانات قبل أي عملية رفع أو حفظ
    const rawData = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      position: formData.get("position"),
      message: formData.get("message"),
    };

    const validation = jobSchema.safeParse(rawData);
    if (!validation.success) {
      alert("❌ خطأ: " + validation.error.issues[0].message);
      return;
    }

    setUploading(true);
    const file = formData.get("cv") as File;

    try {
      if (!file) throw new Error("يرجى اختيار ملف السيرة الذاتية");

      // 2. رفع الملف إلى ImageKit بدلاً من Supabase Storage
      const authRes = await fetch("/api/imagekit-auth");
      const authData = await authRes.json();

      const { signature, token, expire } = authData;
      const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
      const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

      // إضافة سجل للتأكد من وصول المفتاح للكلاينت
      console.log("🛠️ Debug ImageKit:", { hasPublicKey: !!publicKey, hasEndpoint: !!urlEndpoint });

      if (!publicKey || !urlEndpoint) {
        console.error("❌ ImageKit Error: Check your .env.local for NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT");
        throw new Error("إعدادات الرفع غير مكتملة، يرجى مراجعة مدير النظام");
      }

      const ikFormData = new FormData();
      ikFormData.append("file", file);
      ikFormData.append("fileName", `CV_${Date.now()}_${file.name}`);
      ikFormData.append("publicKey", publicKey);
      ikFormData.append("signature", signature);
      ikFormData.append("expire", String(expire));
      ikFormData.append("token", token);
      ikFormData.append("folder", "/cv_applications");

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: ikFormData,
      });

      const ikResult = await uploadRes.json();

      // التأكد من استلام الرابط قبل محاولة الحفظ في Supabase
      if (!uploadRes.ok || !ikResult.url) {
        console.error("❌ ImageKit Upload Failure:", {
          status: uploadRes.status,
          ikResponse: ikResult
        });
        throw new Error("فشل الحصول على رابط السيرة الذاتية من خادم الرفع");
      }

      const cvUrl = ikResult.url;
      console.log("🔗 CV Public URL:", cvUrl);

      // 4. تجهيز الأوبجكت لإرساله لقاعدة البيانات
      const applicationData: JobApplication = {
        full_name: String(formData.get("full_name")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone")),
        position: String(formData.get("position")),
        message: String(formData.get("message") || ""),
        cv_url: cvUrl,
        cv_filename: file.name,
        is_general: true
      };

      // 5. الإرسال للجدول (نستخدم as any للبيانات لتجاوز خطأ الـ Type 'never')
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([applicationData] as any);

      if (insertError) throw insertError;

      alert("✅ تم إرسال طلبك وسيرتك الذاتية بنجاح!");
      (e.target as HTMLFormElement).reset();
      setSelectedFile(null);

    } catch (error: any) {
      console.error("Error Log:", error);
      alert("❌ حدث خطأ: " + (error.message || "فشل في عملية الإرسال"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">انضم إلى فريقنا</h2>
          <p className="text-gray-500">سوف نقوم بمراجعة طلبك والتواصل معك في أقرب وقت</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">الاسم الكامل</label>
            <input name="full_name" type="text" required placeholder="أحمد محمد" 
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">البريد الإلكتروني</label>
            <input name="email" type="email" required placeholder="example@mail.com" 
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">رقم الهاتف</label>
            <input name="phone" type="tel" required placeholder="05xxxxxxxx" 
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">الوظيفة المستهدفة</label>
            <input name="position" type="text" required placeholder="مثال: مطور واجهات" 
              className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">رسالة للمسؤول (اختياري)</label>
          <textarea name="message" rows={4} placeholder="تحدث عن خبراتك باختصار..." 
            className="w-full p-3 rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">السيرة الذاتية (PDF فقط)</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative bg-gray-50/50"
          >
            <input 
              name="cv" 
              type="file" 
              ref={fileInputRef}
              accept=".pdf" 
              required 
              onChange={handleFileChange}
              className="hidden" 
            />
            <p className="text-blue-600 font-medium">
              {selectedFile ? `📄 ${selectedFile.name}` : "اضغط لرفع الملف أو اسحبه هنا"}
            </p>
            <p className="text-xs text-gray-400 mt-1">الحجم الأقصى: 5 ميجابايت</p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 transition duration-300 disabled:bg-gray-400 disabled:shadow-none"
        >
          {uploading ? "جاري المعالجة..." : "إرسال الطلب الآن"}
        </button>
      </form>
    </div>
  );
}