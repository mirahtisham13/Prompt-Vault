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

type Mode = 'perks' | 'signin' | 'signup' | 'phone';

export default function AuthModal({ onClose, reason = 'welcome' }: AuthModalProps) {
  const router = useRouter();
  
  // Start on 'signin' if reason is 'login' or they directly clicked "Sign In", otherwise show perks
  const [mode, setMode] = useState<Mode>(reason === 'login' ? 'signin' : 'perks');
  
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
      if (mode === 'signup') {
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


  // Content for the perks view
  if (mode === 'perks') {
    return (
      <div className={`modal-overlay open ${styles.overlay}`} role="dialog" aria-modal="true">
        <div className={`modal-box ${styles.box}`}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
          <div className={styles.topBar} />
          
          <div className={styles.inner}>
            <div className={styles.logoRow}>
              <div className={styles.logoIcon}><Zap size={22} strokeWidth={2.5} /></div>
              <span className={styles.logoText}>Prompt<span className="gradient-text">Bytes</span></span>
            </div>


            <div className={styles.perks}>
              <div className={styles.perk}>
                <span className={styles.perkIcon} style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}><Crown size={16} /></span>
                <div>
                  <div className={styles.perkTitle}>Premium Prompts</div>
                  <div className={styles.perkDesc}>Exclusive hand-crafted prompts locked for members only</div>
                </div>
              </div>
              <div className={styles.perk}>
                <span className={styles.perkIcon} style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}><Bookmark size={16} /></span>
                <div>
                  <div className={styles.perkTitle}>Save Favourites</div>
                  <div className={styles.perkDesc}>Bookmark prompts to your personal library</div>
                </div>
              </div>
              <div className={styles.perk}>
                <span className={styles.perkIcon} style={{ background: 'rgba(6,182,212,0.15)', color: '#22d3ee' }}><Sparkles size={16} /></span>
                <div>
                  <div className={styles.perkTitle}>Always Free</div>
                  <div className={styles.perkDesc}>No credit card needed — sign up in seconds</div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.googleBtn} onClick={handleGoogle}>
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </button>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setMode('signin')}>
                Sign in with Email or Phone
              </button>
            </div>


          </div>
        </div>
      </div>
    );
  }

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
            {mode === 'signup' ? 'Create account' : 'Welcome back'}
          </h2>
          <p className={styles.subtitle} style={{ textAlign: 'center' }}>
            {mode === 'signup' ? 'Join free to unlock premium prompts & favourites' : 'Sign in to access premium prompts and your favourites'}
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.successBox}>{success}</div>}

          <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading} style={{ marginTop: '16px' }}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <>
              <div className={styles.divider}><span>or</span></div>
              <form onSubmit={handleEmailAuth} className={styles.form}>
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
                  {loading ? 'Loading…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </form>
              <button className={styles.switchBtn} onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}>
                {mode === 'signin' ? "Don't have an account? Sign up free" : 'Already have an account? Sign in'}
              </button>
            </>
          
          {reason !== 'login' && (
            <button className={styles.skipBtn} onClick={() => setMode('perks')}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
