'use client';
import { SortOption } from '@/lib/types';
import { TrendingUp, Clock, Heart, Star } from 'lucide-react';
import styles from './FilterBar.module.css';

const SORT_OPTIONS: { value: SortOption; label: string; Icon: React.ElementType }[] = [
  { value: 'newest',      label: 'Newest',      Icon: Clock },
  { value: 'most_liked',  label: 'Most Liked',  Icon: Heart },
  { value: 'most_copied', label: 'Most Copied', Icon: TrendingUp },
  { value: 'featured',    label: 'Featured',    Icon: Star },
];

interface FilterBarProps {
  activeSort: SortOption;
  onSort: (s: SortOption) => void;
}

export default function FilterBar({ activeSort, onSort }: FilterBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.section}>
          <span className={styles.label}>Sort By</span>
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
