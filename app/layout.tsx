import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/ToastProvider';
import { AuthProvider } from '@/lib/auth-context';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'PromptBytes — The Ultimate AI Prompt Library',
  description: 'Discover thousands of hand-curated AI prompts for Gemini, ChatGPT, Midjourney, DALL·E, Claude, Stable Diffusion and more. Copy, like, and share the best prompts for free.',
  keywords: 'AI prompts, prompt library, Gemini prompts, ChatGPT prompts, Midjourney prompts',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL 
    ? process.env.NEXT_PUBLIC_APP_URL 
    : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://promptbytes.app'),
  openGraph: {
    type: 'website',
    title: 'PromptBytes — The Ultimate AI Prompt Library',
    description: 'Thousands of premium AI prompts for every platform. Free forever.',
    siteName: 'PromptBytes',
    images: [
      {
        url: '/api/og?title=The%20Ultimate%20AI%20Prompt%20Library&platform=PromptBytes',
        width: 1200,
        height: 630,
        alt: 'PromptBytes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptBytes — The Ultimate AI Prompt Library',
    description: 'Thousands of premium AI prompts for every platform. Free forever.',
    images: ['/api/og?title=The%20Ultimate%20AI%20Prompt%20Library&platform=PromptBytes'],
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
