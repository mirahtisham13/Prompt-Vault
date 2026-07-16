'use client';
import { useState, useEffect } from 'react';
import { Heart, Copy, Share2, Maximize2, CheckCircle, Crown, Lock, Bookmark, BookmarkCheck } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { PLATFORM_META, copyToClipboard, formatNumber, truncateText } from '@/lib/utils';
import { useToast } from './ToastProvider';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import PromptFormatter from './PromptFormatter';
import AuthModal from './AuthModal';
import styles from './PromptCard.module.css';

interface PromptCardProps {
  prompt: Prompt;
  onOpenModal: (prompt: Prompt) => void;
  onShare: (prompt: Prompt) => void;
}

export default function PromptCard({ prompt, onOpenModal, onShare }: PromptCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [likes, setLikes] = useState(prompt.likes);
  const [copies, setCopies] = useState(prompt.copies);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authReason, setAuthReason] = useState<'premium' | 'favourite'>('premium');

  const platform = PLATFORM_META[prompt.platform] ?? PLATFORM_META['gemini'];
  const category = MOCK_CATEGORIES.find(c => c.slug === prompt.category);
  const { truncated, isTruncated } = truncateText(prompt.text, 45);
  const isLocked = prompt.is_premium && !user;

  // Check if already bookmarked
  useEffect(() => {
    if (!user) { setBookmarked(false); return; }
    supabase
      .from('favourites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', prompt.id)
      .maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [user, prompt.id]);

  // Check if already liked locally
  useEffect(() => {
    const likedPrompts = JSON.parse(localStorage.getItem('pv-liked-prompts') || '[]');
    if (likedPrompts.includes(prompt.id)) {
      setLiked(true);
    }
  }, [prompt.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => { 
      const next = !prev; 
      setLikes(l => next ? l + 1 : l - 1); 
      
      const likedPrompts = JSON.parse(localStorage.getItem('pv-liked-prompts') || '[]');
      
      if (next) {
        toast('Added to favorites! ❤️');
        // Track local count
        const currentLikes = parseInt(localStorage.getItem('pv-total-likes') || '0', 10);
        localStorage.setItem('pv-total-likes', (currentLikes + 1).toString());
        // Track specific prompt
        if (!likedPrompts.includes(prompt.id)) {
          likedPrompts.push(prompt.id);
          localStorage.setItem('pv-liked-prompts', JSON.stringify(likedPrompts));
        }
      } else {
        // Untrack specific prompt if unliked
        const updatedPrompts = likedPrompts.filter((id: string) => id !== prompt.id);
        localStorage.setItem('pv-liked-prompts', JSON.stringify(updatedPrompts));
      }
      
      fetch('/api/track-like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: prompt.id, action: next ? 'like' : 'unlike' })
      }).catch(console.error);
      return next; 
    });
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) { setAuthReason('premium'); setShowAuthModal(true); return; }
    try {
      await copyToClipboard(prompt.text);
      setCopied(true); setCopies(c => c + 1); toast('Prompt copied! ✨');
      
      // Track local count
      const currentCopies = parseInt(localStorage.getItem('pv-total-copies') || '0', 10);
      localStorage.setItem('pv-total-copies', (currentCopies + 1).toString());

      setTimeout(() => setCopied(false), 2000);
      fetch('/api/track-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: prompt.id })
      }).catch(console.error);
    } catch { toast('Failed to copy', 'error'); }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { setAuthReason('favourite'); setShowAuthModal(true); return; }
    if (bookmarked) {
      await supabase.from('favourites').delete().eq('user_id', user.id).eq('prompt_id', prompt.id);
      setBookmarked(false);
      toast('Removed from favourites');
    } else {
      await supabase.from('favourites').insert({ user_id: user.id, prompt_id: prompt.id });
      setBookmarked(true);
      toast('Saved to favourites! 🔖');
    }
  };

  const handleCardClick = () => {
    if (isLocked) { setAuthReason('premium'); setShowAuthModal(true); return; }
    onOpenModal(prompt);
  };

  return (
    <>
      <article className={`card ${styles.card} ${isLocked ? styles.locked : ''}`}>
        {prompt.image_url && (
          <div className={styles.imageWrap} onClick={handleCardClick}>
            <img src={prompt.image_url} alt={prompt.title} className={styles.image} loading="lazy" />
            <div className={styles.imageOverlay}>
              {isLocked ? <Lock size={20} /> : <Maximize2 size={20} />}
            </div>
            {prompt.is_premium && <span className={`badge ${styles.premiumBadge}`}><Crown size={10} fill="currentColor" /> Premium</span>}
          </div>
        )}
        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{prompt.title}</h3>
            {prompt.is_premium && !prompt.image_url && (
              <span className={`badge ${styles.premiumBadge}`}><Crown size={10} fill="currentColor" /> Premium</span>
            )}
          </div>
          <div className={styles.textWrap}>
            <p className={`${styles.text} ${isLocked ? styles.blurText : ''}`}>
              <PromptFormatter text={showFull ? prompt.text : truncated} />
            </p>
            {isLocked && (
              <button className={styles.unlockBtn} onClick={handleCardClick}>
                <Lock size={13} /> Sign in to unlock
              </button>
            )}
            {!isLocked && isTruncated && <button className={styles.showMore} onClick={() => setShowFull(p => !p)}>{showFull ? 'Show less' : 'Show more'}</button>}
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
            <button className={`${styles.actionBtn} ${bookmarked ? styles.bookmarked : ''}`} onClick={handleBookmark} aria-label={bookmarked ? 'Remove bookmark' : 'Save to favourites'}>
              {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            </button>
            <button className={styles.actionBtn} onClick={e => { e.stopPropagation(); onShare(prompt); }} aria-label="Share"><Share2 size={15} /></button>
            <button className={`${styles.copyFullBtn} btn btn-primary`} onClick={handleCopy}>
              {isLocked ? <><Lock size={14} /> Unlock</> : copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy Prompt</>}
            </button>
          </div>
        </div>
      </article>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} reason={authReason} />}
    </>
  );
}
