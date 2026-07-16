'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './login.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Invalid email or password. Please try again.');
      } else if (data.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        await supabase.auth.signOut();
        setError('Access denied: You do not have admin privileges.');
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}><Zap size={22} strokeWidth={2.5} /></span>
          <span className={styles.logoText}>Prompt<strong>Vault</strong></span>
        </div>

        <div className={styles.header}>
          <div className={styles.lockIcon}><Lock size={20} /></div>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>Access the PromptBytes control panel</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              className={`input ${styles.input}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@promptbytes.app"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.passWrap}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className={`input ${styles.input}`}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass(p => !p)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
