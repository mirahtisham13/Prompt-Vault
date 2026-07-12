import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptVault — The Ultimate AI Prompt Library',
  description: 'Discover thousands of hand-curated AI prompts for Gemini, ChatGPT, Midjourney, DALL·E, Claude, Stable Diffusion and more. Copy, like, and share the best prompts for free.',
  keywords: 'AI prompts, prompt library, Gemini prompts, ChatGPT prompts, Midjourney prompts',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    title: 'PromptVault — The Ultimate AI Prompt Library',
    description: 'Thousands of premium AI prompts for every platform. Free forever.',
    siteName: 'PromptVault',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('pv-theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
