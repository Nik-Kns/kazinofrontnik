import { NextResponse } from 'next/server';
import { KB_MOCK, KB_VERSION } from '@/lib/knowledge-base';

export async function GET(request: Request, context: any) {
  const { id } = context?.params || {};
  const metric = KB_MOCK.find(m => m.id === id);
  if (!metric) {
    return new NextResponse('Not Found', { status: 404 });
  }
  return NextResponse.json({ kbVersion: KB_VERSION, metric });
}


