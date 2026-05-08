// src/app/[locale]/layout.tsx
import { auth }            from "@/auth";
import { SessionProvider } from "@/components/auth/SessionProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ← جيب الـ session على الـ Server قبل ما الصفحة تتبعت
  const session = await auth();

  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}