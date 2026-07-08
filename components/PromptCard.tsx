'use client';
import { useState } from 'react';
import { Heart, Copy, Share2, Maximize2, CheckCircle, Star } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { PLATFORM_META, copyToClipboard, formatNumber, truncateText } from '@/lib/utils';
import { useToast } from './ToastProvider';
import styles from './PromptCard.module.css';

interface PromptCardProps {
  prompt: Prompt;
  onOpenModal: (prompt: Prompt) => void;
  onShare: (prompt: Prompt) => void;
}

export default function PromptCard({ prompt, onOpenModal, onShare }: PromptCardProps) {
  const { toast } = useToast();
  const [likes, setLikes] = useState(prompt.likes);
  const [copies, setCopies] = useState(prompt.copies);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const platform = PLATFORM_META[prompt.platform] ?? PLATFORM_META['gemini'];
  const category = MOCK_CATEGORIES.find(c => c.slug === prompt.category);
  const { truncated, isTruncated } = truncateText(prompt.text, 45);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => { const next = !prev; setLikes(l => next ? l + 1 : l - 1); if (next) toast('Added to favorites! ❤️'); return next; });
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(prompt.text);
      setCopied(true); setCopies(c => c + 1); toast('Prompt copied! ✨');
      setTimeout(() => setCopied(false), 2000);
    } catch { toast('Failed to copy', 'error'); }
  };

  return (
    <article className={`card ${styles.card}`}>
      {prompt.image_url && (
        <div className={styles.imageWrap} onClick={() => onOpenModal(prompt)}>
          <img src={prompt.image_url} alt={prompt.title} className={styles.image} loading="lazy" />
          <div className={styles.imageOverlay}><Maximize2 size={20} /></div>
          {prompt.is_featured && <span className={`badge ${styles.featuredBadge}`}><Star size={10} fill="currentColor" /> Featured</span>}
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.meta}>
          {category && <span className={`badge ${styles.catBadge}`} style={{ '--cat-color': category.color } as React.CSSProperties}>{category.icon} {category.name}</span>}
          <span className={`badge ${styles.platformBadge}`} style={{ '--p-color': platform.color } as React.CSSProperties}>{platform.emoji} {platform.label}</span>
        </div>
        <h3 className={styles.title}>{prompt.title}</h3>
        <div className={styles.textWrap}>
          <p className={styles.text}>{showFull ? prompt.text : truncated}</p>
          {isTruncated && <button className={styles.showMore} onClick={() => setShowFull(p => !p)}>{showFull ? 'Show less' : 'Show more'}</button>}
        </div>
        {prompt.tags?.length > 0 && (
          <div className={styles.tags}>{prompt.tags.slice(0, 4).map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}</div>
        )}
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${liked ? styles.liked : ''}`} onClick={handleLike} aria-label={liked ? 'Unlike' : 'Like'}>
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} /><span>{formatNumber(likes)}</span>
          </button>
          <button className={`${styles.actionBtn} ${copied ? styles.copyDone : ''}`} onClick={handleCopy} aria-label="Copy">
            {copied ? <CheckCircle size={15} /> : <Copy size={15} />}<span>{copied ? 'Copied!' : formatNumber(copies)}</span>
          </button>
          <button className={styles.actionBtn} onClick={e => { e.stopPropagation(); onShare(prompt); }} aria-label="Share"><Share2 size={15} /></button>
          <button className={`${styles.copyFullBtn} btn btn-primary`} onClick={handleCopy}>
            {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy Prompt</>}
          </button>
        </div>
      </div>
    </article>
  );
}
