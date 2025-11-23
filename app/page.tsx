'use client';

import { useState, useEffect } from 'react';

interface VideoInfo {
  id: string;
  title: string;
  status: string;
  youtubeId?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const generateVideo = async () => {
    setLoading(true);
    setMessage('Generating video... This may take a few minutes.');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 1, autoUpload: false }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Video generated successfully! ID: ${data.videoId}`);
        fetchVideos();
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Failed to generate video: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎬 YouTube Shorts Automation</h1>
        <p style={styles.subtitle}>AI-Powered Video Generation Pipeline</p>
      </div>

      <div style={styles.actions}>
        <button
          onClick={generateVideo}
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? '⏳ Generating...' : '🚀 Generate New Video'}
        </button>
      </div>

      {message && (
        <div
          style={{
            ...styles.message,
            ...(message.includes('❌') ? styles.messageError : styles.messageSuccess),
          }}
        >
          {message}
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📊 Pipeline Status</h2>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{videos.length}</div>
            <div style={styles.statLabel}>Total Videos</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {videos.filter(v => v.status === 'uploaded').length}
            </div>
            <div style={styles.statLabel}>Uploaded</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>
              {videos.filter(v => v.status === 'completed').length}
            </div>
            <div style={styles.statLabel}>Ready</div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📹 Recent Videos</h2>
        <div style={styles.videoList}>
          {videos.length === 0 ? (
            <div style={styles.emptyState}>
              No videos yet. Click "Generate New Video" to start!
            </div>
          ) : (
            videos.map(video => (
              <div key={video.id} style={styles.videoCard}>
                <div style={styles.videoInfo}>
                  <div style={styles.videoTitle}>{video.title}</div>
                  <div style={styles.videoMeta}>
                    <span style={styles.videoDate}>
                      {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      style={{
                        ...styles.videoStatus,
                        ...(video.status === 'uploaded'
                          ? styles.statusUploaded
                          : video.status === 'completed'
                          ? styles.statusCompleted
                          : styles.statusFailed),
                      }}
                    >
                      {video.status}
                    </span>
                  </div>
                </div>
                {video.youtubeId && (
                  <a
                    href={`https://youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.youtubeLink}
                  >
                    Watch on YouTube →
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>⚙️ Setup Instructions</h2>
        <div style={styles.instructions}>
          <h3 style={styles.instructionTitle}>1. Configure API Keys</h3>
          <p style={styles.instructionText}>
            Create a <code>.env</code> file with your API keys:
          </p>
          <pre style={styles.code}>
{`ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
PEXELS_API_KEY=your_key
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret
YOUTUBE_REFRESH_TOKEN=your_refresh_token`}
          </pre>

          <h3 style={styles.instructionTitle}>2. Run Pipeline Manually</h3>
          <pre style={styles.code}>npm run run-pipeline</pre>

          <h3 style={styles.instructionTitle}>3. Schedule Automation</h3>
          <pre style={styles.code}>npm run scheduler</pre>

          <h3 style={styles.instructionTitle}>4. Customize Settings</h3>
          <p style={styles.instructionText}>
            Edit <code>scripts/runPipeline.ts</code> to customize niche, video count, and more.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
    color: 'white',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
    margin: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  button: {
    backgroundColor: '#fff',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  message: {
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'center' as const,
    fontWeight: '500',
  },
  messageSuccess: {
    backgroundColor: '#10b981',
    color: 'white',
  },
  messageError: {
    backgroundColor: '#ef4444',
    color: 'white',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1f2937',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    backgroundColor: '#f3f4f6',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  videoList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  videoCard: {
    backgroundColor: '#f9fafb',
    padding: '1.5rem',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  videoMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
  },
  videoDate: {
    color: '#6b7280',
  },
  videoStatus: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontWeight: '500',
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
  },
  statusUploaded: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusCompleted: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  statusFailed: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  youtubeLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
    whiteSpace: 'nowrap' as const,
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#6b7280',
    fontSize: '1.125rem',
  },
  instructions: {
    color: '#374151',
  },
  instructionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
  },
  instructionText: {
    marginBottom: '0.75rem',
    lineHeight: '1.6',
  },
  code: {
    backgroundColor: '#1f2937',
    color: '#10b981',
    padding: '1rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    overflow: 'auto',
    marginBottom: '1rem',
  },
};
