import { NextResponse } from 'next/server';
import { ResearchServices } from '@/lib/services/research';

export async function POST(request: Request) {
  try {
    const { prediction_id } = await request.json();

    const result = await ResearchServices.member3.getExplanation(prediction_id);

    return NextResponse.json({
      success: true,
      memberId: 'member3',
      ...result
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
