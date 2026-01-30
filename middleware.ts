import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Proteger rotas /admin (exceto /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    // A verificação de autenticação será feita no cliente
    // O middleware apenas permite a requisição passar
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
