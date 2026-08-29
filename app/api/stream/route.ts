import { NextResponse } from 'next/server';

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

    // 1. Try Piped Open API (High Speed YouTube Video Stream Proxy)
    const pipedInstances = [
      `https://pipedapi.kavin.rocks/streams/${videoId}`,
      `https://piped-api.garudalinux.org/streams/${videoId}`,
      `https://api.piped.privacydev.net/streams/${videoId}`,
    ];

    for (const pipedUrl of pipedInstances) {
      try {
        const pipedRes = await fetch(pipedUrl);
        if (pipedRes.ok) {
          const pipedData = await pipedRes.json();
          if (pipedData.videoStreams && pipedData.videoStreams.length > 0) {
            const mp4Stream = pipedData.videoStreams.find((s: any) => s.mimeType?.includes('mp4') && s.videoOnly === false)
              || pipedData.videoStreams.find((s: any) => s.mimeType?.includes('mp4'))
              || pipedData.videoStreams[0];
            if (mp4Stream && mp4Stream.url) {
              mediaUrl = mp4Stream.url;
              break;
            }
          }
        }
      } catch {
        //
      }
    }

    // 2. Backup Cobalt Stream API
    if (mediaUrl && !mediaUrl.includes('googlevideo.com') && !mediaUrl.includes('stream')) {
      try {
        const cobaltRes = await fetch('https://api.cobalt.tools/api/json', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: cleanYtUrl,
            downloadMode: 'auto',
            videoQuality: '720',
          }),
        });

        if (cobaltRes.ok) {
          const data = await cobaltRes.json();
          if (data.url) mediaUrl = data.url;
          else if (data.picker && data.picker.length > 0) mediaUrl = data.picker[0].url;
        }
      } catch {
        //
      }
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

    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);

    return new NextResponse(mediaRes.body, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Media stream error' }, { status: 500 });
  }
}
