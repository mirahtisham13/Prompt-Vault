import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Use',
  description: 'Learn how to get the best results from PromptBytes. Find, copy, and use AI prompts for ChatGPT, Gemini, Claude, Midjourney, and more in just a few clicks.',
  alternates: { canonical: '/how-to-use' },
  openGraph: {
    title: 'How to Use PromptBytes | AI Prompt Library',
    description: 'Learn how to find, copy, and use AI prompts for ChatGPT, Gemini, Claude, Midjourney, and more in just a few clicks.',
    url: '/how-to-use',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'How to Use PromptBytes | AI Prompt Library',
    description: 'Learn how to find, copy, and use AI prompts for ChatGPT, Gemini, Claude, Midjourney, and more in just a few clicks.',
  },
};

export default function HowToUsePage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '24px' }} className="gradient-text">How to Use PromptBytes</h1>
      
      <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-primary)' }}>1. Find the Perfect Prompt</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            Browse our homepage to discover the latest and most popular prompts. You can use the search bar at the top to find specific topics, or use the "Sort By" options to filter by Newest, Most Liked, or Most Copied.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-primary)' }}>2. Fill in the Variables</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            Many of our advanced prompts contain variables like <span className="prompt-variable">[Topic]</span> or <span className="prompt-variable">[Tone]</span>. When you click on a prompt, you'll see a modal pop up. We automatically highlight these variables for you. Before you copy, make sure you know what you want to replace these placeholders with!
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-primary)' }}>3. Copy and Paste</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            Once you've found a prompt you like, simply click the "Copy" button. The prompt text will instantly be copied to your clipboard. Head over to ChatGPT, Claude, Midjourney, or your AI tool of choice, and paste it in!
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-primary)' }}>4. Like and Share</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            Found a prompt that gave you incredible results? Hit the heart icon to like it so others can discover it easily. You can also use the Share button to send the exact prompt directly to your friends or colleagues.
          </p>
        </div>

      </div>
    </div>
  );
}
