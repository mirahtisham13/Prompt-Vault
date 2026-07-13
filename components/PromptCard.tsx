'use client';
import { useState } from 'react';
import { Heart, Copy, Share2, Maximize2, CheckCircle, Lock } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { PLATFORM_META, copyToClipboard, formatNumber, truncateText } from '@/lib/utils';
import { useToast } from './ToastProvider';
import { useAuth } from './AuthProvider';
import PromptFormatter from './PromptFormatter';
import styles from './PromptCard.module.css';

interface PromptCardProps {
  prompt: Prompt;
  onOpenModal: (prompt: Prompt) => void;
  onShare: (prompt: Prompt) => void;
}

export default function PromptCard({ prompt, onOpenModal, onShare }: PromptCardProps) {
  const { toast } = useToast();
  const { user, signInWithGoogle } = useAuth();
  const [copies, setCopies] = useState(prompt.copies);
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const platform = PLATFORM_META[prompt.platform] ?? PLATFORM_META['gemini'];
  const category = MOCK_CATEGORIES.find(c => c.slug === prompt.category);
  const { truncated, isTruncated } = truncateText(prompt.text, 45);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await copyToClipboard(prompt.text);
      setCopied(true); setCopies(c => c + 1); toast('Prompt copied! ✨');
      setTimeout(() => setCopied(false), 2000);
      fetch('/api/track-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: prompt.id })
      }).catch(console.error);
    } catch { toast('Failed to copy', 'error'); }
  };

  const handleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast('Sign in to save favourites ❤️');
      signInWithGoogle();
      return;
    }
    setFavLoading(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      if (isFav) {
        await supabase.from('favourites').delete()
          .eq('user_id', user.id).eq('prompt_id', prompt.id);
        setIsFav(false);
        toast('Removed from favourites');
      } else {
        await supabase.from('favourites').insert({ user_id: user.id, prompt_id: prompt.id });
        setIsFav(true);
        toast('Saved to favourites ❤️');
      }
    } catch { toast('Failed to update favourites', 'error'); }
    setFavLoading(false);
  };

  return (
    <article className={`card ${styles.card}`}>
      {prompt.image_url && (
        <div className={styles.imageWrap} onClick={() => onOpenModal(prompt)}>
          <img src={prompt.image_url} alt={prompt.title} className={styles.image} loading="lazy" />
          <div className={styles.imageOverlay}><Maximize2 size={20} /></div>
          {prompt.is_premium && (
            <span className={`badge ${styles.premiumBadge}`}>👑 Premium</span>
          )}
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{prompt.title}</h3>
          {prompt.is_premium && !prompt.image_url && (
            <span className={styles.premiumInline}>👑</span>
          )}
        </div>
        <div className={styles.textWrap}>
          <p className={styles.text}>
            <PromptFormatter text={showFull ? prompt.text : truncated} />
          </p>
          {isTruncated && <button className={styles.showMore} onClick={() => setShowFull(p => !p)}>{showFull ? 'Show less' : 'Show more'}</button>}
        </div>
        {prompt.tags?.length > 0 && (
          <div className={styles.tags}>{prompt.tags.slice(0, 4).map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}</div>
        )}
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${isFav ? styles.favActive : ''}`}
            onClick={handleFavourite}
            disabled={favLoading}
            aria-label={isFav ? 'Remove from favourites' : 'Save to favourites'}
            title={!user ? 'Sign in to save favourites' : (isFav ? 'Remove from favourites' : 'Save to favourites')}
          >
            <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
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
