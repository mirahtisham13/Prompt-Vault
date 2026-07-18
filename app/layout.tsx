import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/ToastProvider';
import { AuthProvider } from '@/lib/auth-context';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'PromptBytes — The Ultimate AI Prompt Library',
    template: '%s | PromptBytes',
  },
  description: 'Discover thousands of hand-curated AI prompts for ChatGPT, Gemini, Claude, Midjourney, DALL·E, and Stable Diffusion. Copy, like, and save the best free AI prompts instantly.',
  keywords: [
    'AI prompts', 'prompt library', 'ChatGPT prompts', 'Gemini prompts', 'Claude prompts',
    'Midjourney prompts', 'DALL-E prompts', 'Stable Diffusion prompts', 'prompt engineering',
    'AI tools', 'free AI prompts', 'best AI prompts', 'AI writing prompts', 'image generation prompts',
    'productivity prompts', 'coding prompts', 'creative writing AI',
  ],
  authors: [{ name: 'PromptBytes' }],
  creator: 'PromptBytes',
  publisher: 'PromptBytes',
  category: 'Technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'https://promptbytes.vercel.app'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'PromptBytes — The Ultimate AI Prompt Library',
    description: 'Thousands of premium AI prompts for ChatGPT, Gemini, Claude, Midjourney & more. Free forever.',
    siteName: 'PromptBytes',
    images: [
      {
        url: '/api/og?title=The%20Ultimate%20AI%20Prompt%20Library&platform=PromptBytes',
        width: 1200,
        height: 630,
        alt: 'PromptBytes — AI Prompt Library',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptBytes — The Ultimate AI Prompt Library',
    description: 'Thousands of premium AI prompts for ChatGPT, Gemini, Claude, Midjourney & more. Free forever.',
    images: ['/api/og?title=The%20Ultimate%20AI%20Prompt%20Library&platform=PromptBytes'],
    creator: '@promptbytes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('pv-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: 1 }}>
                  {children}
                </div>
                <Footer />
              </div>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
