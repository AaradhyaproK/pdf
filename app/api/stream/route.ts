import { NextResponse } from 'next/server';
import ytdl from '@distube/ytdl-core';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let mediaUrl = searchParams.get('url');
  const filename = searchParams.get('filename') || 'youtube-video.mp4';

  if (!mediaUrl) {
    return NextResponse.json({ error: 'Missing media URL parameter' }, { status: 400 });
  }

  // Extract YouTube Video ID
  const ytMatch = mediaUrl.match(/(?:watch\?v=|shorts\/|youtu\.be\/|ssyoutube\.com\/watch\?v=|embed\/|v\/|watch\?.+&v=)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1] && !mediaUrl.includes('googlevideo.com') && !mediaUrl.includes('stream')) {
    const videoId = ytMatch[1];
    const cleanYtUrl = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      // Use @distube/ytdl-core to fetch stream url natively
      const info = await ytdl.getInfo(cleanYtUrl);
      
      try {
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
        if (format && format.url) {
          mediaUrl = format.url;
        }
      } catch (e) {
        const formatVideo = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
        if (formatVideo && formatVideo.url) {
          mediaUrl = formatVideo.url;
        }
      }
    } catch (err: any) {
      console.error('ytdl error:', err);
    }
  }

  const targetFetchUrl = mediaUrl;
  if (!targetFetchUrl) {
    return NextResponse.json({ error: 'Unable to resolve video stream' }, { status: 400 });
  }

  try {
    const mediaRes = await fetch(targetFetchUrl, {
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
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(mediaRes.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Media stream error' }, { status: 500 });
  }
}
