import { NextResponse } from 'next/server';
import { ResearchServices } from '@/lib/services/research';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const result = await ResearchServices.member4.retrieveKnowledge(query);

    return NextResponse.json({
      success: true,
      memberId: 'member4',
      ...result
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve knowledge' }, { status: 500 });
  }
}
