#!/usr/bin/env tsx

import cron from 'node-cron';
import { runFullPipeline } from './runPipeline';

// Default: Run daily at 10 AM
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 10 * * *';

console.log('🤖 YouTube Shorts Automation Scheduler Started');
console.log(`📅 Schedule: ${CRON_SCHEDULE}`);
console.log(`🎯 Niche: AI & AI money-making`);
console.log(`📹 Videos per run: 1`);
console.log('---');

// Validate cron expression
if (!cron.validate(CRON_SCHEDULE)) {
  console.error('❌ Invalid cron schedule:', CRON_SCHEDULE);
  process.exit(1);
}

// Schedule the pipeline
cron.schedule(CRON_SCHEDULE, async () => {
  console.log('\n⏰ Scheduled run triggered at:', new Date().toISOString());

  try {
    await runFullPipeline({
      niche: 'AI & AI money-making',
      count: 1,
      autoUpload: true,
    });
    console.log('✅ Scheduled run completed successfully');
  } catch (error) {
    console.error('❌ Scheduled run failed:', error);
  }
});

console.log('✅ Scheduler is running. Press Ctrl+C to stop.');

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Scheduler stopped');
  process.exit(0);
});

// Prevent process from exiting
setInterval(() => {}, 1000);
