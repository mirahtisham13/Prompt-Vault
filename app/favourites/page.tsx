'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Zap, ArrowLeft, Copy, Share2, Maximize2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Prompt } from '@/lib/types';
import { PLATFORM_META, copyToClipboard, formatNumber, truncateText } from '@/lib/utils';
import { useToast } from '@/components/ToastProvider';
import PromptFormatter from '@/components/PromptFormatter';
import SkeletonCard from '@/components/SkeletonCard';
import styles from './favourites.module.css';

export default function FavouritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [fetching, setFetching] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setFetching(true);
      const { data } = await supabase
        .from('favourites')
        .select('prompt_id, prompts(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        const extracted = data
          .map((row: any) => row.prompts)
          .filter(Boolean) as Prompt[];
        setPrompts(extracted);
      }
      setFetching(false);
    };
    fetch();
  }, [user]);

  const handleRemove = async (promptId: string) => {
    if (!user) return;
    await supabase.from('favourites').delete().eq('user_id', user.id).eq('prompt_id', promptId);
    setPrompts(prev => prev.filter(p => p.id !== promptId));
    toast('Removed from favourites');
  };

  const handleCopy = async (prompt: Prompt) => {
    try {
      await copyToClipboard(prompt.text);
      setCopiedId(prompt.id);
      toast('Prompt copied! ✨');
      setTimeout(() => setCopiedId(null), 2000);
      fetch('/api/track-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: prompt.id })
      }).catch(console.error);
    } catch { toast('Failed to copy', 'error'); }
  };

  if (loading || !user) return null;

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={16} /> Back to Library
        </Link>

        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <Heart size={28} fill="currentColor" />
          </div>
          <div>
            <h1 className={styles.title}>My Favourites</h1>
            <p className={styles.subtitle}>
              {fetching ? 'Loading…' : `${prompts.length} saved prompt${prompts.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {fetching ? (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : prompts.length === 0 ? (
          <div className={styles.empty}>
            <Heart size={48} className={styles.emptyIcon} />
            <h2>No favourites yet</h2>
            <p>Heart any prompt from the library to save it here.</p>
            <Link href="/" className="btn btn-primary">Browse Prompts</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {prompts.map(prompt => {
              const platform = PLATFORM_META[prompt.platform] ?? PLATFORM_META['gemini'];
              const { truncated, isTruncated } = truncateText(prompt.text, 60);
              const isCopied = copiedId === prompt.id;

              return (
                <article key={prompt.id} className={`card ${styles.card}`}>
                  {prompt.image_url && (
                    <div className={styles.imageWrap}>
                      <img src={prompt.image_url} alt={prompt.title} className={styles.image} loading="lazy" />
                      {prompt.is_premium && <span className={styles.premiumBadge}>👑 Premium</span>}
                    </div>
                  )}
                  <div className={styles.body}>
                    <h3 className={styles.cardTitle}>
                      {prompt.title}
                      {prompt.is_premium && !prompt.image_url && <span className={styles.premiumInline}>👑</span>}
                    </h3>
                    <p className={styles.cardText}>
                      <PromptFormatter text={truncated} />
                    </p>
                    {prompt.tags?.length > 0 && (
                      <div className={styles.tags}>
                        {prompt.tags.slice(0, 3).map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
                      </div>
                    )}
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.removeBtn}`}
                        onClick={() => handleRemove(prompt.id)}
                        title="Remove from favourites"
                      >
                        <Heart size={14} fill="currentColor" />
                      </button>
                      <button className={`${styles.actionBtn} ${isCopied ? styles.copyDone : ''}`} onClick={() => handleCopy(prompt)}>
                        {isCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
                        <span>{isCopied ? 'Copied!' : formatNumber(prompt.copies)}</span>
                      </button>
                      <button
                        className={`${styles.copyFullBtn} btn btn-primary`}
                        onClick={() => handleCopy(prompt)}
                      >
                        {isCopied ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy Prompt</>}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
