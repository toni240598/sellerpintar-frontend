import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Daftar route publik yang tidak perlu token
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  const isPublic = publicRoutes.includes(pathname)

  // Jika akses private route tanpa token, redirect ke login
  if (!isPublic && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Terapkan ke seluruh app kecuali static
export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)'], // semua halaman, kecuali static
}
