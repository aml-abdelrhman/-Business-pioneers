import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// ─── Validation Schema ────────────────────────────────────────────────────────
const contactSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName:  z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{8,20}$/, "Invalid phone format")
    .optional()
    .or(z.literal('')),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

// ─── Clients ──────────────────────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    // 1. Parse JSON safely
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Empty request body" },
        { status: 400 }
      );
    }

    // 2. Zod validation
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, subject, message } =
      validation.data;

    // 3. ── Email verification via Abstract API ──────────────────────────────
    //    API key is stored in .env as ABSTRACT_EMAIL_API_KEY
    //    Same key works for both email & phone endpoints on Abstract API
    const abstractKey = process.env.ABSTRACT_EMAIL_API_KEY;

    if (abstractKey) {
      try {
        const emailVerifyRes = await fetch(
          `https://emailvalidation.abstractapi.com/v1/?api_key=${abstractKey}&email=${encodeURIComponent(email)}`
        );

        if (!emailVerifyRes.ok) {
          console.warn("Abstract Email API returned non-200:", emailVerifyRes.status);
        } else {
          const emailData = await emailVerifyRes.json();

          console.log("Abstract Email Result:", emailData);

          // التحقق من الإيميلات المؤقتة (Disposable)
          if (emailData.is_disposable_email?.value === true) {
            return NextResponse.json(
              {
                success: false,
                error: "الإيميلات المؤقتة غير مقبولة. يرجى استخدام بريد حقيقي.",
              },
              { status: 400 }
            );
          }

          // نرفض فقط إذا أكد الـ API أن الإيميل غير موجود فعلياً (UNDELIVERABLE)
          // ونسمح بـ DELIVERABLE و RISKY و UNKNOWN لضمان عدم رفض العملاء الحقيقيين
          if (emailData.deliverability === "UNDELIVERABLE") {
            return NextResponse.json(
              {
                success: false,
                error: "البريد الإلكتروني غير موجود أو لا يستقبل رسائل حالياً.",
              },
              { status: 400 }
            );
          }
        }
      } catch (err) {
        // Never let verification failure block the user — log and continue
        console.error("Email Verification API error:", err);
      }
    }

    // 4. ── Phone verification via Abstract API ─────────────────────────────
    //    Uses ABSTRACT_EMAIL_API_KEY for the phone endpoint too
    //    (Abstract issues separate keys per product — if you have a dedicated
    //     ABSTRACT_PHONE_API_KEY, swap process.env.ABSTRACT_EMAIL_API_KEY below)
    if (abstractKey && phone && phone.trim() !== '') {
      try {
        const phoneVerifyRes = await fetch(
          `https://phonevalidation.abstractapi.com/v1/?api_key=${abstractKey}&phone=${encodeURIComponent(phone)}`
        );

        if (!phoneVerifyRes.ok) {
          console.warn("Abstract Phone API returned non-200:", phoneVerifyRes.status);
        } else {
          const phoneData = await phoneVerifyRes.json();

          console.log("Abstract Phone Result:", phoneData);

          if (phoneData.valid === false) {
            return NextResponse.json(
              {
                success: false,
                error:
                  "رقم الهاتف غير صحيح أو غير مفعّل. تأكد من الرقم الدولي.",
              },
              { status: 400 }
            );
          }
        }
      } catch (err) {
        console.error("Phone Verification API error:", err);
      }
    }

    // 5. ── Save to Supabase ────────────────────────────────────────────────
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ first_name: firstName, last_name: lastName, email, phone, subject, message }]);

    if (dbError) {
      console.error("Supabase DB Error:", dbError.message);
      return NextResponse.json(
        { success: false, error: dbError.message },
        { status: 500 }
      );
    }

    // 6. ── Send email via Resend ───────────────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['aml586651@gmail.com'],
        subject: `New Message: ${subject}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error("API Route Error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}