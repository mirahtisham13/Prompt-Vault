'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Crown, Bookmark, Sparkles, Zap, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  onClose: () => void;
  reason?: 'premium' | 'favourite' | 'welcome' | 'login';
}

type Mode = 'select' | 'email';

export default function AuthModal({ onClose, reason = 'welcome' }: AuthModalProps) {
  const router = useRouter();
  
  const [mode, setMode] = useState<Mode>('select');
  const [isSignup, setIsSignup] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGoogle = async () => {
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Check your email to confirm your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

    setLoading(false);
  };

  // The login form view
  return (
    <div className={`modal-overlay open ${styles.overlay}`} role="dialog" aria-modal="true">
      <div className={`modal-box ${styles.box}`}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className={styles.topBar} />
        
        <div className={styles.inner}>
          <div className={styles.logoRow} style={{ justifyContent: 'center', marginBottom: '8px' }}>
            <div className={styles.logoIcon}><Zap size={22} strokeWidth={2.5} /></div>
            <span className={styles.logoText}>Prompt<span className="gradient-text">Bytes</span></span>
          </div>

          <h2 className={styles.title} style={{ textAlign: 'center' }}>
            {mode === 'select' ? (isSignup ? 'Create account' : 'Welcome back') : (isSignup ? 'Create account' : 'Sign in')}
          </h2>
          <p className={styles.subtitle} style={{ textAlign: 'center' }}>
            {mode === 'select' ? (isSignup ? 'Join free to unlock premium prompts & favourites' : 'Sign in to access premium prompts and your favourites') : 'Continue with Email'}
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.successBox}>{success}</div>}

          {mode === 'select' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>
              
              <div className={styles.divider}><span>or</span></div>
              
              <button className={`btn btn-ghost`} style={{ border: '1px solid var(--border)' }} onClick={() => { setMode('email'); setError(''); setSuccess(''); }}>
                <Mail size={16} /> Continue with Email
              </button>
              
              <button className={styles.switchBtn} style={{ marginTop: '16px' }} onClick={() => { setIsSignup(s => !s); setError(''); setSuccess(''); }}>
                {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up free"}
              </button>
            </div>
          )}

          {mode === 'email' && (
            <>
              <form onSubmit={handleEmailAuth} className={styles.form} style={{ marginTop: '16px' }}>
                <div className={styles.field}>
                  <label>Email</label>
                  <div className={styles.inputWrap}>
                    <Mail size={15} className={styles.inputIcon} />
                    <input type="email" className={`input ${styles.input}`} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Password</label>
                  <div className={styles.inputWrap}>
                    <input type={showPass ? 'text' : 'password'} className={`input ${styles.input}`} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>{showPass ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Loading…' : isSignup ? 'Create Account' : 'Sign In'}
                </button>
              </form>
              <button className={styles.switchBtn} onClick={() => { setMode('select'); setError(''); setSuccess(''); }}>
                ← Back to options
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
