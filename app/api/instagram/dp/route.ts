import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let rawUsername = searchParams.get('username') || searchParams.get('url') || '';

  if (rawUsername.includes('instagram.com/')) {
    rawUsername = rawUsername.split('instagram.com/')[1].split('/')[0].split('?')[0];
  }
  const username = rawUsername.replace('@', '').replace(/[^a-zA-Z0-9._]/g, '').trim();

  if (!username) {
    return NextResponse.json({ error: 'Missing username parameter' }, { status: 400 });
  }

  let hdPhotoUrl: string | null = null;
  let fullName = username;
  let bio = '';
  let followerCount = 0;
  let isVerified = false;

  // 1. Try Instagram Web Profile Info API
  try {
    const apiRes = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'X-IG-App-ID': '936619743392459',
        'Accept': '*/*',
        'Sec-Fetch-Site': 'same-origin',
      },
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      const user = data?.data?.user;
      if (user) {
        hdPhotoUrl = user.profile_pic_url_hd || user.profile_pic_url;
        fullName = user.full_name || username;
        bio = user.biography || '';
        followerCount = user.edge_followed_by?.count || 0;
        isVerified = user.is_verified || false;
      }
    }
  } catch {
    //
  }

  // 2. Fallback: DDInstagram OpenGraph Profile Scraper
  if (!hdPhotoUrl) {
    try {
      const htmlRes = await fetch(`https://ddinstagram.com/${username}/`, {
        headers: {
          'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        },
      });

      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/);
        if (ogImage && ogImage[1]) {
          hdPhotoUrl = ogImage[1];
        }
        const ogTitle = html.match(/property="og:title"\s+content="([^"]+)"/);
        if (ogTitle && ogTitle[1]) {
          fullName = ogTitle[1].split('(@')[0].trim();
        }
      }
    } catch {
      //
    }
  }

  // 3. Fallback: Unavatar Service
  if (!hdPhotoUrl) {
    hdPhotoUrl = `https://unavatar.io/instagram/${username}`;
  }

  // Proxy image URL to avoid CORS/Hotlinking restrictions
  const proxyPhotoUrl = `/api/instagram/proxy-image?url=${encodeURIComponent(hdPhotoUrl)}&filename=${username}_dp.jpg`;

  return NextResponse.json({
    success: true,
    username,
    fullName,
    bio,
    followerCount,
    isVerified,
    photoUrl: proxyPhotoUrl,
    rawPhotoUrl: hdPhotoUrl,
    profileUrl: `https://www.instagram.com/${username}/`,
  });
}
