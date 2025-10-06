import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Добавляем HTTP-заголовки для запрета индексации
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');

  return response;
}

// Применяем middleware ко всем маршрутам
export const config = {
  matcher: '/:path*',
};
