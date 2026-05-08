import { NextResponse } from 'next/server';
import { ResearchServices } from '@/lib/services/research';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const result = await ResearchServices.member2.classifyIntent(text);

    return NextResponse.json({
      success: true,
      memberId: 'member2',
      ...result
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to classify intent' }, { status: 500 });
  }
}
