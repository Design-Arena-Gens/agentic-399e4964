import { NextRequest, NextResponse } from 'next/server';
import { runFullPipeline } from '@/scripts/runPipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count = 1, autoUpload = false, niche = 'AI & AI money-making' } = body;

    console.log('API: Starting pipeline...', { count, autoUpload, niche });

    const results = await runFullPipeline({
      niche,
      count,
      autoUpload,
    });

    return NextResponse.json({
      success: true,
      videoId: results[0]?.id,
      results,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
