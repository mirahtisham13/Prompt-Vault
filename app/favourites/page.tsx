'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Bookmark, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Prompt } from '@/lib/types';
import PromptCard from '@/components/PromptCard';
import PromptModal from '@/components/PromptModal';
import ShareModal from '@/components/ShareModal';
import Header from '@/components/Header';
import styles from './favourites.module.css';

export default function FavouritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [sharePrompt, setSharePrompt] = useState<Prompt | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const fetchFavourites = async () => {
      setFetching(true);
      const { data } = await supabase
        .from('favourites')
        .select('prompt_id, prompts(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (data) {
        const favPrompts = data
          .map((f: any) => f.prompts)
          .filter(Boolean) as Prompt[];
        setPrompts(favPrompts);
      }
      setFetching(false);
    };
    fetchFavourites();
  }, [user]);

  if (loading || !user) return null;

  const filtered = prompts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <Header onSearch={setSearch} searchValue={search} />
      <div className={`container ${styles.inner}`}>
        <div className={styles.heroRow}>
          <div className={styles.heroIcon}><Bookmark size={28} /></div>
          <div>
            <h1 className={styles.title}>My Favourites</h1>
            <p className={styles.subtitle}>{prompts.length} saved prompt{prompts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {fetching ? (
          <div className={styles.loading}><Loader2 size={32} className={styles.spinner} /></div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <Bookmark size={48} className={styles.emptyIcon} />
            <h2>{prompts.length === 0 ? "You haven't saved any prompts yet" : 'No results found'}</h2>
            <p>{prompts.length === 0 ? 'Browse the library and click the bookmark icon to save prompts here.' : 'Try a different search term.'}</p>
            {prompts.length === 0 && (
              <Link href="/" className="btn btn-primary" style={{ marginTop: '16px' }}>Browse Prompts</Link>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(prompt => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onOpenModal={setSelectedPrompt}
                onShare={setSharePrompt}
              />
            ))}
          </div>
        )}
      </div>

      <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} onShare={p => { setSelectedPrompt(null); setSharePrompt(p); }} />
      <ShareModal prompt={sharePrompt} onClose={() => setSharePrompt(null)} />
    </div>
  );
}
