#!/usr/bin/env tsx

import path from 'path';
import fs from 'fs';
import { generateScript } from '../lib/scriptGenerator';
import { generateTTS } from '../lib/ttsGenerator';
import { fetchStockFootage, searchFootageKeywords } from '../lib/footageFetcher';
import { createVideoFromScript } from '../lib/videoComposer';
import { generateMetadata } from '../lib/metadataGenerator';
import { youtubeUploader } from '../lib/youtubeUploader';
import { VideoScript, VideoFile } from '../types';

async function runFullPipeline(options: {
  niche?: string;
  count?: number;
  autoUpload?: boolean;
}) {
  const { niche = 'AI & AI money-making', count = 1, autoUpload = false } = options;

  console.log('🚀 Starting YouTube Shorts Pipeline');
  console.log(`📝 Generating ${count} script(s) for niche: ${niche}`);

  const outputDir = path.join(process.cwd(), 'public', 'videos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results: VideoFile[] = [];

  for (let i = 0; i < count; i++) {
    try {
      console.log(`\n--- Processing Video ${i + 1}/${count} ---`);

      // Step 1: Generate script
      console.log('📝 Generating script...');
      const script = await generateScript(niche);
      console.log(`✅ Script generated: "${script.title}"`);

      // Step 2: Create video-specific directory
      const videoDir = path.join(outputDir, script.id);
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }

      // Step 3: Generate TTS audio
      console.log('🎤 Generating TTS audio...');
      const audioPath = path.join(videoDir, 'audio.mp3');
      await generateTTS(script.script, audioPath, 'onyx');
      console.log(`✅ Audio generated: ${audioPath}`);

      // Step 4: Fetch stock footage
      console.log('🎬 Fetching stock footage...');
      const keywords = await searchFootageKeywords(script.script);
      const footagePaths = await fetchStockFootage(
        keywords[0] || 'technology',
        script.duration,
        videoDir
      );
      console.log(`✅ Footage fetched: ${footagePaths.length} clips`);

      // Step 5: Compose video
      console.log('🎥 Composing video...');
      const videoPath = await createVideoFromScript(
        script,
        audioPath,
        footagePaths,
        videoDir
      );
      console.log(`✅ Video composed: ${videoPath}`);

      // Step 6: Generate metadata
      console.log('📊 Generating metadata...');
      const affiliateLinks = [
        process.env.AFFILIATE_LINK_1,
        process.env.AFFILIATE_LINK_2,
      ].filter(Boolean) as string[];

      const metadata = generateMetadata(script, affiliateLinks);
      console.log(`✅ Metadata generated`);

      // Save video info
      const videoFile: VideoFile = {
        id: script.id,
        filePath: videoPath,
        audioPath,
        metadata,
        status: 'completed',
        createdAt: new Date(),
      };

      // Step 7: Upload to YouTube (if enabled)
      if (autoUpload) {
        try {
          console.log('📤 Uploading to YouTube...');
          const youtubeId = await youtubeUploader.uploadVideo(videoPath, metadata);
          videoFile.youtubeId = youtubeId;
          videoFile.status = 'uploaded';
          console.log(`✅ Uploaded to YouTube: https://youtube.com/watch?v=${youtubeId}`);
        } catch (error: any) {
          console.error('❌ Upload failed:', error.message);
          videoFile.status = 'failed';
          videoFile.error = error.message;
        }
      }

      results.push(videoFile);

      // Save results to JSON
      const resultsPath = path.join(videoDir, 'info.json');
      fs.writeFileSync(resultsPath, JSON.stringify(videoFile, null, 2));

      console.log(`✅ Video ${i + 1} completed!`);
    } catch (error: any) {
      console.error(`❌ Failed to process video ${i + 1}:`, error.message);
    }
  }

  // Summary
  console.log('\n📊 Pipeline Summary:');
  console.log(`Total videos processed: ${results.length}`);
  console.log(`Completed: ${results.filter(v => v.status === 'completed' || v.status === 'uploaded').length}`);
  console.log(`Uploaded: ${results.filter(v => v.status === 'uploaded').length}`);
  console.log(`Failed: ${results.filter(v => v.status === 'failed').length}`);

  return results;
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    niche: args[0] || 'AI & AI money-making',
    count: parseInt(args[1] || '1'),
    autoUpload: args[2] === 'true',
  };

  runFullPipeline(options)
    .then(() => {
      console.log('\n✅ Pipeline completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Pipeline failed:', error);
      process.exit(1);
    });
}

export { runFullPipeline };
