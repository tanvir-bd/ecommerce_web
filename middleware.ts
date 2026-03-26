import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userId = request.cookies.get('userId');
    const { pathname } = request.nextUrl;

    // Redirect logged-in users away from login/signup pages
    if (userId && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Protect routes that require authentication
    if (!userId && (pathname.startsWith('/profile') || pathname.startsWith('/checkout'))) {
        return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
