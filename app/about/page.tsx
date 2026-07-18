import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about PromptBytes — the ultimate free AI prompt library for ChatGPT, Gemini, Claude, Midjourney, and more. Our mission is to democratize prompt engineering for everyone.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About PromptBytes | AI Prompt Library',
    description: 'Learn about PromptBytes — the ultimate free AI prompt library for ChatGPT, Gemini, Claude, Midjourney, and more.',
    url: '/about',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About PromptBytes | AI Prompt Library',
    description: 'Learn about PromptBytes — the ultimate free AI prompt library for ChatGPT, Gemini, Claude, Midjourney, and more.',
  },
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '24px' }} className="gradient-text">About PromptBytes</h1>
      
      <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          Welcome to <strong style={{ color: 'var(--text-primary)' }}>PromptBytes</strong>, your premier destination for high-quality, curated AI prompts.
        </p>
        
        <h2 style={{ fontSize: '24px', marginTop: '16px', color: 'var(--text-primary)' }}>Our Mission</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          As artificial intelligence continues to evolve, the ability to communicate effectively with AI models—known as prompt engineering—has become an essential skill. Our mission is to democratize access to this skill by providing a comprehensive, easy-to-use library of the best prompts available.
        </p>
        
        <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          Whether you're a developer looking to generate code, a marketer writing copy, or an artist creating stunning visuals, PromptBytes gives you the exact words you need to get the best results from platforms like ChatGPT, Midjourney, Claude, and Gemini.
        </p>

        <h2 style={{ fontSize: '24px', marginTop: '16px', color: 'var(--text-primary)' }}>Why Choose Us?</h2>
        <ul style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li><strong style={{ color: 'var(--text-primary)' }}>Quality Assured:</strong> Every prompt is carefully reviewed to ensure it produces consistent, high-quality outputs.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>100% Free:</strong> We believe knowledge should be accessible. Our entire library is free to browse and copy.</li>
          <li><strong style={{ color: 'var(--text-primary)' }}>Community Driven:</strong> See what's trending, find the most copied prompts, and discover what others find useful.</li>
        </ul>
      </div>
    </div>
  );
}
