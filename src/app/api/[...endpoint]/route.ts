import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getLocale } from "next-intl/server";
import api from "@/lib/api";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const lang = await getLocale();
  const pathAfterApi = url.href.split('/api')[1].replace(/^\/+/, '');
  let request;
  const contentType = req.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    request = await req.json(); // Parse as JSON if content type is JSON
  } else if (contentType?.includes("multipart/form-data")) {
    request = await req.formData(); // Parse as FormData if content type is FormData
  } else {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }

  try {
    const data = await api.request.post(
      pathAfterApi,
      request,
      {
        headers: {
          'Content-Type': contentType?.includes("application/json") ? "application/json" : 'multipart/form-data',
          'Authorization': `Bearer ${session?.token}`,
          "Accept-Language": lang ?? "ar"
        }
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.log(error?.response);
    const statusCode = error?.response?.status || 500;
    
    // If status is 401, handle unauthorized access
    if (statusCode === 401) {
      // Return a specific response that will trigger the logout in the frontend
      return NextResponse.json({ error: "Unauthorized", message: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json(error?.response?.data, { status: statusCode });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const pathAfterApi = url.href.split('/api')[1].replace(/^\/+/, '');
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const lang = await getLocale();
  let request;
  const contentType = req.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    request = await req.json(); // Parse as JSON if content type is JSON
  } else if (contentType?.includes("multipart/form-data")) {
    request = await req.formData(); // Parse as FormData if content type is FormData
  } else {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 415 });
  }
  try {
    const data = await api.request.put(
      pathAfterApi,
      request,
      {
        headers: {
          'Content-Type': contentType?.includes("application/json") ? "application/json" : 'multipart/form-data',
          'Authorization': `Bearer ${session?.token}`,
          "Accept-Language": lang ?? "ar"
        },
      }
    );
    return NextResponse.json(data);
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    
    // If status is 401, handle unauthorized access
    if (statusCode === 401) {
      // Return a specific response that will trigger the logout in the frontend
      return NextResponse.json({ error: "Unauthorized", message: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json(error?.response?.data, { status: statusCode });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const pathAfterApi = url.href.split('/api')[1].replace(/^\/+/, '');
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const lang = await getLocale();
  try {
    const data = await api.request.get(pathAfterApi, {
      headers: {
        'Authorization': `Bearer ${session?.token}`,
        "Accept-Language": lang ?? "ar"
      }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.log('NextResponse', error);
    const statusCode = error?.response?.status || 500;
    
    // If status is 401, handle unauthorized access
    if (statusCode === 401) {
      // Return a specific response that will trigger the logout in the frontend
      return NextResponse.json({ error: "Unauthorized", message: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json(error?.response?.data, { status: statusCode });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const pathAfterApi = url.href.split('/api')[1].replace(/^\/+/, '');
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const lang = await getLocale();

  try {
    const data = await api.request.delete(pathAfterApi, {
      headers: {
        'Authorization': `Bearer ${session?.token}`,
        "Accept-Language": lang ?? "ar"
      }
    });
    return NextResponse.json(data);
  } catch (error: any) {
    console.log('NextResponse', error);
    const statusCode = error?.response?.status || 500;
    
    // If status is 401, handle unauthorized access
    if (statusCode === 401) {
      // Return a specific response that will trigger the logout in the frontend
      return NextResponse.json({ error: "Unauthorized", message: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json(error?.response?.data, { status: statusCode });
  }
}