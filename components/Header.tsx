'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Zap, X, LogOut, Bookmark, User, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/lib/auth-context';
import styles from './Header.module.css';

interface HeaderProps { onSearch: (q: string) => void; searchValue: string; }

export default function Header({ onSearch, searchValue }: HeaderProps) {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { if (showSearch) inputRef.current?.focus(); }, [showSearch]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    router.refresh();
  };

  const userInitials = user?.email ? user.email[0].toUpperCase() : user?.phone ? '📱' : 'U';

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}><Zap size={18} strokeWidth={2.5} /></span>
          <span className={styles.logoText}>Prompt<span className="gradient-text">Bytes</span></span>
        </Link>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input ref={inputRef} type="text" placeholder="Search prompts, tags, platforms…" value={searchValue} onChange={e => onSearch(e.target.value)} className={styles.searchInput} aria-label="Search prompts" />
          {searchValue && <button onClick={() => onSearch('')} className={styles.clearBtn} aria-label="Clear"><X size={14} /></button>}
        </div>
        <div className={styles.actions}>
          <button className={`${styles.iconBtn} hide-desktop`} onClick={() => setShowSearch(s => !s)} aria-label="Search"><Search size={18} /></button>
          <ThemeToggle />

          {!loading && (
            user ? (
              <div className={styles.userWrap} ref={menuRef}>
                <button className={styles.avatarBtn} onClick={() => setShowUserMenu(s => !s)} aria-label="User menu">
                  <span className={styles.avatar}>{userInitials}</span>
                  <ChevronDown size={14} className={showUserMenu ? styles.chevronUp : ''} />
                </button>
                {showUserMenu && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropEmail}>{user.email || user.phone}</div>
                    <Link href="/favourites" className={styles.dropItem} onClick={() => setShowUserMenu(false)}>
                      <Bookmark size={14} /> My Favourites
                    </Link>
                    <button className={`${styles.dropItem} ${styles.signOutItem}`} onClick={handleSignOut}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={`btn btn-primary ${styles.signInBtn}`}>
                Sign In
              </Link>
            )
          )}
        </div>
      </div>
      {showSearch && (
        <div className={`container ${styles.mobileSearch}`}>
          <Search size={15} className={styles.searchIcon} />
          <input type="text" placeholder="Search prompts…" value={searchValue} onChange={e => onSearch(e.target.value)} className={styles.searchInput} autoFocus />
          {searchValue && <button onClick={() => onSearch('')} className={styles.clearBtn}><X size={14} /></button>}
        </div>
      )}
    </header>
  );
}
