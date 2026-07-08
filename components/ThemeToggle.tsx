'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import styles from './ThemeToggle.module.css';
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button className={styles.toggle} onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <span className={styles.track}>
        <span className={styles.thumb}>{theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}</span>
      </span>
    </button>
  );
}
