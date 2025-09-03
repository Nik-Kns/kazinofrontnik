import { NextResponse } from 'next/server';
import { KB_MOCK, KB_VERSION } from '@/lib/knowledge-base';

export async function GET() {
  return NextResponse.json({ kbVersion: KB_VERSION, metrics: KB_MOCK });
}


