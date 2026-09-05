import { NextResponse } from 'next/server';
import youtubedl from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getFfmpegPath(): string {
  const platform = `${process.platform}-${process.arch}`;
  const candidates = [
    path.join(process.cwd(), `node_modules/@ffmpeg-installer/${platform}/ffmpeg`),
    path.join(process.cwd(), `node_modules/@ffmpeg-installer/${process.platform}-x64/ffmpeg`),
    '/opt/homebrew/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
    '/usr/bin/ffmpeg',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c;
    }
  }
  return 'ffmpeg';
}

function getYtDlp() {
  const binaryPath = path.join(process.cwd(), 'node_modules/youtube-dl-exec/bin/yt-dlp');
  return youtubedl.create(binaryPath);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mediaUrl = searchParams.get('url');
  const requestedFormat = (searchParams.get('format') || 'mp4').toLowerCase();
  const requestedQuality = (searchParams.get('quality') || '720p').toLowerCase();
  let filename = searchParams.get('filename') || (requestedFormat === 'mp3' ? 'youtube-audio.mp3' : 'youtube-video.mp4');

  // Ensure filename has correct extension
  if (requestedFormat === 'mp3' && !filename.endsWith('.mp3')) {
    filename = `${filename.replace(/\.[^/.]+$/, '')}.mp3`;
  } else if (requestedFormat === 'mp4' && !filename.endsWith('.mp4')) {
    filename = `${filename.replace(/\.[^/.]+$/, '')}.mp4`;
  }

  if (!mediaUrl) {
    return NextResponse.json({ error: 'Missing media URL parameter' }, { status: 400 });
  }

  // Check if it is a YouTube URL
  const ytMatch = mediaUrl.match(/(?:watch\?v=|shorts\/|youtu\.be\/|ssyoutube\.com\/watch\?v=|embed\/|v\/|watch\?.+&v=)([a-zA-Z0-9_-]{11})/);

  if (ytMatch && ytMatch[1] && !mediaUrl.includes('googlevideo.com')) {
    const videoId = ytMatch[1];
    const cleanYtUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const tempId = `yt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const ext = requestedFormat === 'mp3' ? 'mp3' : 'mp4';
    const tempFilePath = path.join(os.tmpdir(), `${tempId}.${ext}`);
    const ffmpegPath = getFfmpegPath();
    const ytdl = getYtDlp();

    try {
      if (requestedFormat === 'mp3') {
        await ytdl(cleanYtUrl, {
          ffmpegLocation: ffmpegPath,
          noPlaylist: true,
          jsRuntimes: 'node',
          extractAudio: true,
          audioFormat: 'mp3',
          audioQuality: 0,
          output: tempFilePath,
        }, {
          env: { ...process.env, PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH}` }
        });
      } else {
        let targetHeight = 720;
        if (requestedQuality.includes('1080')) targetHeight = 1080;
        else if (requestedQuality.includes('720')) targetHeight = 720;
        else if (requestedQuality.includes('480')) targetHeight = 480;
        else if (requestedQuality.includes('360')) targetHeight = 360;

        await ytdl(cleanYtUrl, {
          ffmpegLocation: ffmpegPath,
          noPlaylist: true,
          jsRuntimes: 'node',
          format: `bestvideo[height<=${targetHeight}][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=${targetHeight}]+bestaudio/best[height<=${targetHeight}]/best`,
          mergeOutputFormat: 'mp4',
          output: tempFilePath,
        }, {
          env: { ...process.env, PATH: `/opt/homebrew/bin:/usr/local/bin:${process.env.PATH}` }
        });
      }

      if (!fs.existsSync(tempFilePath)) {
        return NextResponse.json({ error: 'Output media file was not generated.' }, { status: 500 });
      }

      const stat = fs.statSync(tempFilePath);
      if (stat.size === 0) {
        try { fs.unlinkSync(tempFilePath); } catch {}
        return NextResponse.json({ error: 'Generated media file is empty.' }, { status: 500 });
      }

      const nodeStream = fs.createReadStream(tempFilePath);
      let isCleanedUp = false;
      const cleanup = () => {
        if (!isCleanedUp) {
          isCleanedUp = true;
          try {
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
          } catch (e) {
            console.error('Error cleaning up temp file:', e);
          }
        }
      };

      nodeStream.on('error', cleanup);
      nodeStream.on('close', cleanup);

      const stream = new ReadableStream({
        start(controller) {
          nodeStream.on('data', (chunk) => {
            controller.enqueue(chunk);
          });
          nodeStream.on('end', () => {
            cleanup();
            controller.close();
          });
          nodeStream.on('error', (err) => {
            cleanup();
            controller.error(err);
          });
        },
        cancel() {
          cleanup();
          nodeStream.destroy();
        }
      });

      const headers = new Headers();
      headers.set('Content-Type', requestedFormat === 'mp3' ? 'audio/mpeg' : 'video/mp4');
      headers.set('Content-Length', stat.size.toString());
      headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`);
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Cache-Control', 'no-store');

      return new NextResponse(stream, {
        status: 200,
        headers,
      });
    } catch (err: any) {
      console.error('YouTube download error:', err);
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch {}
      return NextResponse.json(
        { 
          error: err?.stderr || err?.stdout || err?.message || 'Failed to download YouTube media.'
        },
        { status: 500 }
      );
    }
  }

  // Fallback for direct media URLs
  try {
    const mediaRes = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const contentType = mediaRes.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      return NextResponse.json({ error: 'Video stream extraction failed or service unavailable.' }, { status: 500 });
    }

    const headers = new Headers();
    headers.set('Content-Type', contentType.includes('video') ? contentType : 'video/mp4');
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);

    return new NextResponse(mediaRes.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Media stream error' }, { status: 500 });
  }
}
