// ============================================================
// src/app/api/auth/[...nextauth]/route.ts
// NextAuth v5 Route Handler — handles all /api/auth/* requests
// GET  /api/auth/signin
// GET  /api/auth/signout
// GET  /api/auth/session
// GET  /api/auth/csrf
// GET  /api/auth/providers
// POST /api/auth/signin/credentials
// POST /api/auth/signout
// GET  /api/auth/callback/google
// ============================================================

import { handlers } from "@/auth";
export const { GET, POST } = handlers;

// NOTE: this single re-export is all that is needed in NextAuth v5.
// The `handlers` object exported from src/auth.ts contains
// both GET and POST, which Next.js App Router will call
// for every request to /api/auth/*.