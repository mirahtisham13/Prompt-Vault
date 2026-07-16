'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogOut, Bookmark, Heart, Copy, Loader2, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { Prompt } from '@/lib/types';
import PromptCard from '@/components/PromptCard';
import PromptModal from '@/components/PromptModal';
import ShareModal from '@/components/ShareModal';
import Header from '@/components/Header';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import styles from './profile.module.css';

export default function ProfileDashboard() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [sharePrompt, setSharePrompt] = useState<Prompt | null>(null);
  const [search, setSearch] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  
  const [localCopies, setLocalCopies] = useState(0);
  const [localLikes, setLocalLikes] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Read local stats
    setLocalCopies(parseInt(localStorage.getItem('pv-total-copies') || '0', 10));
    setLocalLikes(parseInt(localStorage.getItem('pv-total-likes') || '0', 10));
  }, []);

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

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const userIdentifier = user.email || user.phone || 'User';

  return (
    <div className={styles.page}>
      <Header onSearch={setSearch} searchValue={search} />
      
      <div className={`container ${styles.inner}`}>
        
        {/* Dashboard Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.heroInfo}>
            <div className={styles.avatarLarge}>
              <User size={32} />
            </div>
            <div>
              <h1 className={styles.title}>Profile Dashboard</h1>
              <p className={styles.subtitle}>{userIdentifier}</p>
            </div>
          </div>
          
          <button className={`btn ${styles.signOutBtn}`} onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Overview Stats */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#a78bfa', background: 'rgba(139, 92, 246, 0.15)', boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)' }}>
                <Copy size={26} strokeWidth={2.5} />
              </div>
              <div>
                <div className={styles.statValue} style={{ background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{localCopies}</div>
                <div className={styles.statLabel}>Prompts Copied</div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#f472b6', background: 'rgba(236, 72, 153, 0.15)', boxShadow: '0 0 30px rgba(236, 72, 153, 0.2)' }}>
                <Heart size={26} strokeWidth={2.5} />
              </div>
              <div>
                <div className={styles.statValue} style={{ background: 'linear-gradient(to right, #fff, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{localLikes}</div>
                <div className={styles.statLabel}>Prompts Liked</div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon} style={{ color: '#22d3ee', background: 'rgba(6, 182, 212, 0.15)', boxShadow: '0 0 30px rgba(6, 182, 212, 0.2)' }}>
                <Bookmark size={26} strokeWidth={2.5} />
              </div>
              <div>
                <div className={styles.statValue} style={{ background: 'linear-gradient(to right, #fff, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{prompts.length}</div>
                <div className={styles.statLabel}>Favourites Saved</div>
              </div>
            </div>
          </div>
        </section>

        {/* My Favourites */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>My Favourites</h2>
          </div>
          
          {fetching ? (
            <div className={styles.loading}><Loader2 size={32} className={styles.spinner} /></div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <Bookmark size={48} className={styles.emptyIcon} />
              <h3>{prompts.length === 0 ? "You haven't saved any prompts yet" : 'No results found'}</h3>
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
        </section>

        {/* Account Settings */}
        <section className={styles.section} style={{ marginTop: '80px', borderTop: '1px solid var(--border)', paddingTop: '32px' }}>
          <h2 className={styles.sectionTitle}>Account Settings</h2>
          <p className={styles.sectionDesc}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button 
            className="btn btn-ghost" 
            style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)' }}
            onClick={() => setShowDelete(true)}
          >
            Delete Account
          </button>
        </section>

      </div>

      <PromptModal prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} onShare={p => { setSelectedPrompt(null); setSharePrompt(p); }} />
      <ShareModal prompt={sharePrompt} onClose={() => setSharePrompt(null)} />
      {showDelete && <DeleteAccountModal onClose={() => setShowDelete(false)} />}
    </div>
  );
}
