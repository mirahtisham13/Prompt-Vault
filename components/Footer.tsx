import Link from 'next/link';
import { Zap } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}><Zap size={15} strokeWidth={2.5} /></span>
          <span className={styles.logoText}>Prompt<span className="gradient-text">Vault</span></span>
        </Link>
        
        <div className={styles.links}>
          <Link href="/about" className={styles.link}>About Us</Link>
          <Link href="/how-to-use" className={styles.link}>How to Use</Link>
          <Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link>
        </div>
      </div>
      
      <div className={styles.copyright}>
        &copy; {currentYear} PromptVault. All rights reserved.
      </div>
    </footer>
  );
}
