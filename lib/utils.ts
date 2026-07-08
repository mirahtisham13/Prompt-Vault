export type Platform = 'all' | 'gemini' | 'chatgpt' | 'midjourney' | 'dalle' | 'claude' | 'stable-diffusion' | 'sora' | 'runway';

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function truncateText(text: string, wordLimit: number): { truncated: string; isTruncated: boolean } {
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return { truncated: text, isTruncated: false };
  return { truncated: words.slice(0, wordLimit).join(' ') + '…', isTruncated: true };
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  return new Promise((resolve, reject) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    ok ? resolve() : reject();
  });
}

export const PLATFORM_META: Record<string, { label: string; color: string; emoji: string }> = {
  all:               { label: 'All Platforms',   color: '#8b5cf6', emoji: '✨' },
  gemini:            { label: 'Gemini',           color: '#4285f4', emoji: '♊' },
  chatgpt:           { label: 'ChatGPT',          color: '#10a37f', emoji: '🤖' },
  midjourney:        { label: 'Midjourney',       color: '#ff6b35', emoji: '🎨' },
  dalle:             { label: 'DALL·E',            color: '#ab68ff', emoji: '🖼️' },
  claude:            { label: 'Claude',            color: '#c57c4b', emoji: '🧠' },
  'stable-diffusion':{ label: 'Stable Diffusion', color: '#e11d48', emoji: '🔬' },
  sora:              { label: 'Sora',              color: '#0ea5e9', emoji: '🎬' },
  runway:            { label: 'Runway',            color: '#7c3aed', emoji: '🛫' },
};

export function getShareUrls(url: string, text: string) {
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(text.slice(0, 200));
  return {
    twitter:  `https://twitter.com/intent/tweet?url=${enc}&text=${encT}`,
    whatsapp: `https://wa.me/?text=${encT}%20${enc}`,
    copy: url,
  };
}
