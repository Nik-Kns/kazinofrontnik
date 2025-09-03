import { NextResponse } from 'next/server';
import { KB_MOCK, KB_VERSION } from '@/lib/knowledge-base';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const metric = KB_MOCK.find(m => m.id === params.id);
  if (!metric) {
    return new NextResponse('Not Found', { status: 404 });
  }
  return NextResponse.json({ kbVersion: KB_VERSION, metric });
}


