export interface VideoScript {
  id: string;
  title: string;
  script: string;
  hook: string;
  cta: string;
  duration: number;
  keywords: string[];
  timestamp: Date;
}

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  category: number; // YouTube category ID (28 = Science & Technology)
  privacyStatus: 'public' | 'private' | 'unlisted';
}

export interface VideoFile {
  id: string;
  filePath: string;
  audioPath: string;
  subtitlesPath?: string;
  metadata: VideoMetadata;
  status: 'pending' | 'processing' | 'completed' | 'uploaded' | 'failed';
  youtubeId?: string;
  error?: string;
  createdAt: Date;
}

export interface StockFootage {
  url: string;
  duration: number;
  source: 'pexels' | 'generated';
}

export interface PipelineConfig {
  scriptsPerDay: number;
  targetDuration: number; // seconds
  niche: string;
  affiliateLinks: string[];
  autoUpload: boolean;
}
