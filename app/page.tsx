'use client';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import PromptCard from '@/components/PromptCard';
import SkeletonCard from '@/components/SkeletonCard';
import PromptModal from '@/components/PromptModal';
import ShareModal from '@/components/ShareModal';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/lib/auth-context';
import { Prompt, FilterState, SortOption } from '@/lib/types';
import { Platform } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import styles from './page.module.css';

const PAGE_SIZE = 9;

function applyFilters(prompts: Prompt[], filters: FilterState): Prompt[] {
  let result = [...prompts];

  if (filters.category && filters.category !== 'all') {
    result = result.filter(p => p.category === filters.category);
  }
  if (filters.platform && filters.platform !== 'all') {
    result = result.filter(p => p.platform === filters.platform);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.text.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.platform.toLowerCase().includes(q)
    );
  }
  if (filters.tags?.length) {
    result = result.filter(p => filters.tags.every(tag => p.tags?.includes(tag)));
  }

  switch (filters.sort) {
    case 'most_liked':  result.sort((a, b) => b.likes - a.likes); break;
    case 'most_copied': result.sort((a, b) => b.copies - a.copies); break;
    case 'premium':    result.sort((a, b) => (b.is_premium ? 1 : 0) - (a.is_premium ? 1 : 0)); break;
    case 'newest':
    default:            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [page, setPage] = useState(1);
  const [activeModal, setActiveModal] = useState<Prompt | null>(null);
  const [sharePrompt, setSharePrompt] = useState<Prompt | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    platform: 'all',
    search: '',
    sort: 'newest',
    tags: [],
  });

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setPrompts(data as Prompt[]);
      }
      setLoading(false);
    };
    fetchPrompts();
  }, []);

  // Show welcome modal for guests after a 1-second delay
  useEffect(() => {
    if (authLoading) return; // wait until auth is resolved
    if (!user) {
      const timer = setTimeout(() => setShowWelcome(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading]);

  const filtered = useMemo(() => applyFilters(prompts, filters), [prompts, filters]);
  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = paginated.length < filtered.length;

  // Infinite scroll
  useEffect(() => {
    if (!sentinelRef.current || loading) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasMore) setPage(p => p + 1); },
      { rootMargin: '300px' }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [filters]);

  const setFilter = useCallback(<K extends keyof FilterState>(key: K, val: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  }, []);

  const skeletons = Array.from({ length: PAGE_SIZE });

  return (
    <>
      <Header
        onSearch={q => setFilter('search', q)}
        searchValue={filters.search}
      />

      <main>
        <HeroSection />

        <FilterBar
          activeSort={filters.sort}
          onSort={s => setFilter('sort', s as SortOption)}
        />

        <section className={`container ${styles.grid}`}>
          {loading ? (
            skeletons.map((_, i) => <SkeletonCard key={i} />)
          ) : paginated.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>No prompts found</h3>
              <p>Try adjusting your filters or search query</p>
              <button
                className="btn btn-primary"
                onClick={() => setFilters({ category: 'all', platform: 'all', search: '', sort: 'newest', tags: [] })}
              >
                Clear filters
              </button>
            </div>
          ) : (
            paginated.map((prompt, i) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onOpenModal={setActiveModal}
                onShare={setSharePrompt}
              />
            ))
          )}
        </section>

        {/* Infinite scroll sentinel */}
        {!loading && hasMore && (
          <div ref={sentinelRef} className={styles.sentinel}>
            <Loader2 size={24} className={styles.spinner} />
          </div>
        )}

        {/* Results count */}
        {!loading && filtered.length > 0 && (
          <p className={styles.count}>
            Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> prompts
          </p>
        )}
      </main>

      <PromptModal
        prompt={activeModal}
        onClose={() => setActiveModal(null)}
        onShare={p => { setActiveModal(null); setSharePrompt(p); }}
      />
      <ShareModal
        prompt={sharePrompt}
        onClose={() => setSharePrompt(null)}
      />
      {showWelcome && (
        <AuthModal onClose={() => setShowWelcome(false)} reason="welcome" />
      )}
    </>
  );
}
