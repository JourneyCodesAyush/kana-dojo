import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * OG Image Generation Endpoint
 * Generates dynamic Open Graph images for social media sharing
 * URL: /api/og?title=...&description=...&type=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get('title') || 'KanaDojo';
    const description =
      searchParams.get('description') ||
      'Master Japanese with interactive learning';
    const type = searchParams.get('type') || 'default';

    // Define colors and gradients based on type
    const themes = {
      kana: {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        icon: 'あ',
        accentColor: '#667eea',
      },
      kanji: {
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        icon: '漢',
        accentColor: '#f5576c',
      },
      vocabulary: {
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        icon: '語',
        accentColor: '#00f2fe',
      },
      academy: {
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        icon: '学',
        accentColor: '#fa709a',
      },
      default: {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        icon: '道',
        accentColor: '#667eea',
      },
    };

    const theme = themes[type as keyof typeof themes] || themes.default;

    const response = new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.gradient,
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            display: 'flex',
            fontSize: '200px',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
          }}
        >
          {theme.icon}
        </div>

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            maxWidth: '1100px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: '900',
                color: 'white',
                letterSpacing: '-0.05em',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              KanaDojo
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: '900',
              color: 'white',
              textAlign: 'center',
              lineHeight: 1.2,
              marginBottom: '30px',
              textShadow: '0 4px 30px rgba(0,0,0,0.4)',
              maxWidth: '900px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: '30px',
                color: 'rgba(255, 255, 255, 0.95)',
                textAlign: 'center',
                lineHeight: 1.4,
                maxWidth: '800px',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '15px 30px',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: 'white',
              fontWeight: '600',
            }}
          >
            kanadojo.com
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );

    // Add aggressive caching for OG images (24 hours cache, 7 days stale-while-revalidate)
    // Reduces Vercel function invocations and improves social sharing performance
    response.headers.set(
      'Cache-Control',
      'public, max-age=86400, stale-while-revalidate=604800, immutable',
    );

    return response;
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
