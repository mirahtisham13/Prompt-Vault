'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Mail, Phone, Eye, EyeOff, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './login.module.css';

type Mode = 'signin' | 'signup' | 'phone';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) { setError(error.message); setLoading(false); }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) { setError(error.message); }
    else { setOtpSent(true); setSuccess('OTP sent to your phone!'); }
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (error) { setError(error.message); }
    else { router.push('/'); router.refresh(); }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}><Zap size={20} strokeWidth={2.5} /></span>
          <span>Prompt<span className="gradient-text">Bytes</span></span>
        </Link>

        <h1 className={styles.title}>
          {mode === 'signup' ? 'Create account' : mode === 'phone' ? 'Phone sign-in' : 'Welcome back'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'signup' ? 'Join free to unlock premium prompts & favourites' : 'Sign in to access premium prompts and your favourites'}
        </p>

        {error && <div className={styles.errorBox}>{error}</div>}
        {success && <div className={styles.successBox}>{success}</div>}

        {/* Google */}
        {mode !== 'phone' && (
          <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>
        )}

        {mode !== 'phone' && (
          <>
            <div className={styles.divider}><span>or</span></div>

            {/* Email form */}
            <form onSubmit={handleEmailAuth} className={styles.form}>
              <div className={styles.field}>
                <label>Email</label>
                <div className={styles.inputWrap}>
                  <Mail size={15} className={styles.inputIcon} />
                  <input
                    type="email"
                    className={`input ${styles.input}`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Password</label>
                <div className={styles.inputWrap}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`input ${styles.input}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Loading…' : mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <button className={styles.switchBtn} onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}>
              {mode === 'signin' ? "Don't have an account? Sign up free" : 'Already have an account? Sign in'}
            </button>

            <button className={styles.phoneBtn} onClick={() => { setMode('phone'); setError(''); setSuccess(''); }}>
              <Phone size={14} /> Sign in with Phone Number
            </button>
          </>
        )}

        {/* Phone OTP */}
        {mode === 'phone' && (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className={styles.form}>
                <div className={styles.field}>
                  <label>Phone Number</label>
                  <div className={styles.inputWrap}>
                    <Phone size={15} className={styles.inputIcon} />
                    <input
                      type="tel"
                      className={`input ${styles.input}`}
                      placeholder="+1234567890"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Sending…' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className={styles.form}>
                <div className={styles.field}>
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    className={`input ${styles.input}`}
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Verifying…' : 'Verify OTP'}
                </button>
              </form>
            )}
            <button className={styles.switchBtn} onClick={() => { setMode('signin'); setOtpSent(false); setError(''); setSuccess(''); }}>
              ← Back to email sign-in
            </button>
          </>
        )}

        <Link href="/" className={styles.backLink}><X size={13} /> Continue without signing in</Link>
      </div>
    </div>
  );
}
