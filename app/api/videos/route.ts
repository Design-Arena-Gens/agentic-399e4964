import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const videosDir = path.join(process.cwd(), 'public', 'videos');

    if (!fs.existsSync(videosDir)) {
      return NextResponse.json([]);
    }

    const videoFolders = fs.readdirSync(videosDir).filter(file => {
      const fullPath = path.join(videosDir, file);
      return fs.statSync(fullPath).isDirectory();
    });

    const videos = videoFolders
      .map(folder => {
        const infoPath = path.join(videosDir, folder, 'info.json');
        if (fs.existsSync(infoPath)) {
          const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
          return {
            id: info.id,
            title: info.metadata.title,
            status: info.status,
            youtubeId: info.youtubeId,
            createdAt: info.createdAt,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json(videos);
  } catch (error: any) {
    console.error('Failed to fetch videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
