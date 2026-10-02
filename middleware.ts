// cSpell:ignore supabase SUPABASE XVCJ
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {
  // Authentication disabled - allow all routes without checks
  const response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api/|favicon.ico|M.ico).*)',
  ],
};
