import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'PromptBytes';
    const platform = searchParams.get('platform') || 'AI';
    const image = searchParams.get('image');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: '#080811',
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay to ensure text is readable */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(to top, rgba(8, 8, 17, 0.95) 0%, rgba(8, 8, 17, 0.4) 50%, rgba(8, 8, 17, 0.1) 100%)',
            }}
          />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '60px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {platform}
              </div>
              <div
                style={{
                  marginLeft: '20px',
                  color: '#a78bfa',
                  fontSize: '28px',
                  fontWeight: 600,
                }}
              >
                PromptBytes
              </div>
            </div>
            
            <div
              style={{
                fontSize: '64px',
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                maxWidth: '900px',
              }}
            >
              {title}
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
    return new Response('Failed to generate image', { status: 500 });
  }
}
