import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get('title') || 'Free Online PDF, Image & Utility Studio';
    const category = searchParams.get('category') || 'Privacy First Tools';
    const desc = searchParams.get('desc') || '100% private in-browser processing. Zero server uploads.';
    const badge = searchParams.get('badge') || '100% Client-Side Engine';

    // Truncate title and description for optimal 1200x630 rendering
    const displayTitle = title.length > 70 ? title.slice(0, 67) + '...' : title;
    const displayDesc = desc.length > 130 ? desc.slice(0, 127) + '...' : desc;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 70px',
            backgroundColor: '#090d16',
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgba(168, 85, 247, 0.25) 0%, transparent 45%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#ffffff',
          }}
        >
          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Logo + Brand Name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: 900,
                    letterSpacing: '-0.5px',
                    color: '#ffffff',
                  }}
                >
                  FileZenith
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#818cf8',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Private Browser Engine
                </span>
              </div>
            </div>

            {/* Category Tag */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '999px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(129, 140, 248, 0.4)',
                color: '#c7d2fe',
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '0.3px',
              }}
            >
              <span>{category}</span>
            </div>
          </div>

          {/* Center Card Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              maxWidth: '1040px',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            {/* Badge pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#34d399',
                fontSize: '15px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#34d399',
                  boxShadow: '0 0 12px #34d399',
                }}
              />
              <span>{badge}</span>
            </div>

            {/* Headline */}
            <div
              style={{
                fontSize: displayTitle.length > 50 ? '48px' : '56px',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
                color: '#f8fafc',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              {displayTitle}
            </div>

            {/* Subheading / Description */}
            <div
              style={{
                fontSize: '22px',
                fontWeight: 500,
                lineHeight: 1.45,
                color: '#94a3b8',
                maxWidth: '960px',
              }}
            >
              {displayDesc}
            </div>
          </div>

          {/* Bottom Trust & Feature Highlights */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '28px',
              borderTop: '1px solid rgba(148, 163, 184, 0.15)',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>🛡️</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>
                  100% In-Browser Privacy
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>⚡</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>
                  Zero Server Uploads
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '18px' }}>✨</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#e2e8f0' }}>
                  Unlimited & Free Forever
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#6366f1',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '-0.3px',
              }}
            >
              <span>filezenith.com</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
