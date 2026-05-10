// app/api/imagekit-auth/route.ts
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !publicKey || !urlEndpoint) {
      return NextResponse.json(
        { error: "ImageKit configuration missing" },
        { status: 500 }
      );
    }

    const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

    // تمرير expire صريح: 30 دقيقة من الآن
    const authParams = imagekit.getAuthenticationParameters(
      undefined,
      Math.floor(Date.now() / 1000) + 1800 // 30 min
    );

    return NextResponse.json(authParams, {
      headers: {
        // منع الـ caching حتى لا يُعاد استخدام توقيع منتهي الصلاحية
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "Failed to generate auth params" },
      { status: 500 }
    );
  }
}