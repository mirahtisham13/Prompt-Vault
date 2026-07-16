'use client';
import { useRouter } from 'next/navigation';
import { X, Crown, Bookmark } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  onClose: () => void;
  reason?: 'premium' | 'favourite';
}

export default function AuthModal({ onClose, reason = 'premium' }: AuthModalProps) {
  const router = useRouter();

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) console.error(error);
  };

  const goToLogin = () => {
    router.push('/login');
    onClose();
  };

  return (
    <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal-box ${styles.box}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={16} /></button>

        <div className={styles.iconWrap}>
          {reason === 'premium' ? (
            <Crown size={28} className={styles.crownIcon} />
          ) : (
            <Bookmark size={28} className={styles.crownIcon} />
          )}
        </div>

        <h2 className={styles.title}>
          {reason === 'premium' ? 'Unlock Premium Prompt' : 'Save to Favourites'}
        </h2>
        <p className={styles.subtitle}>
          {reason === 'premium'
            ? 'Sign in for free to access premium prompts and unlock your personal favourites vault.'
            : 'Sign in to save prompts to your personal favourites and access them anytime.'}
        </p>

        <div className={styles.perks}>
          <div className={styles.perk}><Crown size={14} /> Access all premium prompts</div>
          <div className={styles.perk}><Bookmark size={14} /> Save unlimited favourites</div>
        </div>

        <button className={styles.googleBtn} onClick={handleGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={goToLogin}>
          Sign in with Email or Phone
        </button>

        <button className={styles.skipBtn} onClick={onClose}>Maybe later</button>
      </div>
    </div>
  );
}
