import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Token varsa ve giriş sayfasındaysa, ana sayfaya yönlendir
    if (req.nextUrl.pathname === '/giris' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Giriş sayfası herkes için erişilebilir
        if (req.nextUrl.pathname === '/giris') {
          return true;
        }
        
        // Diğer sayfalar için token gerekli
        return !!token;
      },
    },
    pages: {
      signIn: '/giris',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Şu yollar HARİÇ tüm yolları eşleştir:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public klasöründeki dosyalar
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

