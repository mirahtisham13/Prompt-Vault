import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider } from '@/components/ToastProvider';
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('pv-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body>
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
      </body>
    </html>
  );
}
