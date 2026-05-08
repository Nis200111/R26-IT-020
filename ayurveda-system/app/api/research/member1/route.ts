import { NextResponse } from 'next/server';
import { ResearchServices } from '@/lib/services/research';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Call the dedicated service
    const result = await ResearchServices.member1.digitizeManuscript(image);

    return NextResponse.json({
      success: true,
      memberId: 'member1',
      module: 'Digitization',
      ...result,
      processing_time: '2.5s'
    });
  } catch (error) {
    console.error('Member 1 API Error:', error);
    return NextResponse.json({ error: 'Failed to process manuscript' }, { status: 500 });
  }
}
