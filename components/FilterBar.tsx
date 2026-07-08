'use client';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { PLATFORM_META } from '@/lib/utils';
import { Platform } from '@/lib/types';
import { SortOption } from '@/lib/types';
import { TrendingUp, Clock, Heart, Star } from 'lucide-react';
import styles from './FilterBar.module.css';

const PLATFORMS = Object.entries(PLATFORM_META).map(([key, val]) => ({ key, ...val }));
const SORT_OPTIONS: { value: SortOption; label: string; Icon: React.ElementType }[] = [
  { value: 'newest',      label: 'Newest',      Icon: Clock },
  { value: 'most_liked',  label: 'Most Liked',  Icon: Heart },
  { value: 'most_copied', label: 'Most Copied', Icon: TrendingUp },
  { value: 'featured',    label: 'Featured',    Icon: Star },
];

interface FilterBarProps {
  activeCategory: string; activePlatform: Platform; activeSort: SortOption;
  onCategory: (c: string) => void; onPlatform: (p: Platform) => void; onSort: (s: SortOption) => void;
}

export default function FilterBar({ activeCategory, activePlatform, activeSort, onCategory, onPlatform, onSort }: FilterBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.section}>
          <span className={styles.label}>Category</span>
          <div className={styles.pills}>
            <button className={`${styles.pill} ${activeCategory === 'all' ? styles.active : ''}`} onClick={() => onCategory('all')}>All</button>
            {MOCK_CATEGORIES.map(cat => (
              <button key={cat.slug} className={`${styles.pill} ${activeCategory === cat.slug ? styles.active : ''}`} onClick={() => onCategory(cat.slug)}>
                <span>{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <span className={styles.label}>Platform</span>
          <div className={styles.pills}>
            {PLATFORMS.map(p => (
              <button key={p.key} className={`${styles.pill} ${styles.platform} ${activePlatform === p.key ? styles.activePlatform : ''}`}
                onClick={() => onPlatform(p.key as Platform)} style={{ '--p-color': p.color } as React.CSSProperties}>
                <span>{p.emoji}</span> {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <span className={styles.label}>Sort</span>
          <div className={styles.sortSelect}>
            {SORT_OPTIONS.map(({ value, label, Icon }) => (
              <button key={value} className={`${styles.sortBtn} ${activeSort === value ? styles.sortActive : ''}`} onClick={() => onSort(value)}>
                <Icon size={13} /><span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
