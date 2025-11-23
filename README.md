# 🎬 YouTube Shorts Automation Pipeline

Fully automated YouTube Shorts generation pipeline powered by AI. Generate, edit, and upload vertical videos targeting the **AI & AI money-making niche** for maximum CPM and affiliate revenue.

## 🚀 Features

- **AI Script Generation**: Claude 3.5 generates viral YouTube Shorts scripts (30-60 seconds)
- **High-Quality TTS**: OpenAI TTS with natural voices
- **Stock Footage**: Automatic fetching from Pexels API
- **Video Composition**: FFmpeg-powered 9:16 vertical video creation with subtitles
- **Smart Metadata**: SEO-optimized titles, descriptions, and tags for high CPM
- **YouTube Upload**: Automated upload via YouTube API
- **Web Dashboard**: Monitor pipeline status and video library
- **Scheduled Automation**: Cron-based daily video generation

## 📋 Prerequisites

- Node.js 18+
- FFmpeg installed on your system
- API Keys:
  - Anthropic (Claude)
  - OpenAI
  - Pexels
  - YouTube API v3

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```env
# Anthropic API for script generation
ANTHROPIC_API_KEY=your_anthropic_api_key

# OpenAI API for TTS
OPENAI_API_KEY=your_openai_api_key

# Pexels API for stock footage
PEXELS_API_KEY=your_pexels_api_key

# YouTube API credentials
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
YOUTUBE_REDIRECT_URI=http://localhost:3000/api/auth/callback
YOUTUBE_REFRESH_TOKEN=your_refresh_token

# Affiliate links (optional)
AFFILIATE_LINK_1=https://your-affiliate-link.com
AFFILIATE_LINK_2=https://your-affiliate-link.com

# Cron schedule (default: daily at 10 AM)
CRON_SCHEDULE=0 10 * * *
```

### 3. Install FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 4. YouTube API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/auth/callback`
6. Get your refresh token (see below)

## 🎯 Usage

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### Generate Videos Manually

```bash
# Generate 1 video
npm run run-pipeline

# Generate multiple videos
tsx scripts/runPipeline.ts "AI & AI money-making" 3 false
```

### Start Scheduler

```bash
tsx scripts/scheduler.ts
```

This runs the pipeline automatically based on your cron schedule.

### Get YouTube Refresh Token

1. Start the dev server: `npm run dev`
2. Visit the auth URL from `youtubeUploader.getAuthUrl()`
3. Complete OAuth flow
4. Copy refresh token from response
5. Add to `.env` file

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Dashboard UI
│   ├── layout.tsx            # Root layout
│   └── api/
│       ├── generate/         # Video generation endpoint
│       ├── videos/           # List videos endpoint
│       └── auth/callback/    # YouTube OAuth callback
├── lib/
│   ├── scriptGenerator.ts    # AI script generation
│   ├── ttsGenerator.ts       # Text-to-speech
│   ├── footageFetcher.ts     # Stock footage fetching
│   ├── videoComposer.ts      # FFmpeg video composition
│   ├── metadataGenerator.ts  # YouTube metadata optimization
│   └── youtubeUploader.ts    # YouTube API integration
├── scripts/
│   ├── runPipeline.ts        # Main pipeline orchestration
│   └── scheduler.ts          # Cron scheduler
└── types/
    └── index.ts              # TypeScript types
```

## 🎥 Pipeline Flow

1. **Script Generation**: Claude generates viral script with hook, body, and CTA
2. **TTS Audio**: OpenAI converts script to high-quality audio
3. **Footage Fetch**: Download relevant stock clips from Pexels
4. **Video Composition**: FFmpeg combines audio, video, and subtitles (9:16 format)
5. **Metadata Generation**: Create SEO-optimized title, description, tags
6. **Upload**: Automatically upload to YouTube with affiliate links

## 💰 Monetization Strategy

### High CPM Keywords
- AI, artificial intelligence
- Make money online, passive income
- Business, finance, investing
- Technology, software, SaaS

### Affiliate Integration
- Add affiliate links in video descriptions
- Update `.env` with your affiliate URLs
- Target high-converting AI tools

### Optimization Tips
- Upload during peak hours (10 AM EST)
- Use trending AI keywords
- Engage with comments
- Cross-promote on social media

## 🔧 Customization

### Change Niche

Edit `scripts/runPipeline.ts`:

```typescript
const script = await generateScript('Your Custom Niche');
```

### Adjust Video Duration

Modify `lib/scriptGenerator.ts` prompt:

```typescript
// Change from 30-60 seconds to 15-30 seconds
"Length: Exactly 100-150 words for 15-30 second read time"
```

### Change TTS Voice

In `lib/ttsGenerator.ts`:

```typescript
// Options: alloy, echo, fable, onyx, nova, shimmer
await generateTTS(text, outputPath, 'nova');
```

### Customize Schedule

Update `.env`:

```env
# Run every 6 hours
CRON_SCHEDULE=0 */6 * * *

# Run twice daily at 10 AM and 6 PM
CRON_SCHEDULE=0 10,18 * * *
```

## 📊 Analytics & Tracking

Videos are saved with metadata in `public/videos/{video-id}/info.json`:

```json
{
  "id": "uuid",
  "filePath": "/path/to/video.mp4",
  "metadata": {
    "title": "Video title",
    "description": "Full description",
    "tags": ["tag1", "tag2"]
  },
  "status": "uploaded",
  "youtubeId": "youtube-video-id",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Check if installed
ffmpeg -version

# Add to PATH if needed
export PATH="$PATH:/path/to/ffmpeg"
```

### API Rate Limits
- Anthropic: 50 requests/min
- OpenAI: 500 requests/min
- Pexels: 200 requests/hour
- YouTube: 10,000 quota units/day

### Video Upload Failed
- Check YouTube API quota
- Verify OAuth refresh token
- Ensure video meets YouTube requirements (< 256 GB, < 12 hours)

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## ⚠️ Disclaimer

This tool is for educational purposes. Ensure you comply with:
- YouTube Terms of Service
- API provider terms
- Copyright laws for stock footage
- FTC guidelines for affiliate disclosures

---

Built with ❤️ using Next.js, Claude AI, OpenAI, and FFmpeg
