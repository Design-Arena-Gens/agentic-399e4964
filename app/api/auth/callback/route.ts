import { NextRequest, NextResponse } from 'next/server';
import { youtubeUploader } from '@/lib/youtubeUploader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const tokens = await youtubeUploader.getTokenFromCode(code);

    return NextResponse.json({
      success: true,
      message: 'Authentication successful! Save this refresh token to your .env file:',
      refresh_token: tokens.refresh_token,
    });
  } catch (error: any) {
    console.error('Auth callback error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
