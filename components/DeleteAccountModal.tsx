'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import styles from './DeleteAccountModal.module.css';

interface DeleteAccountModalProps {
  onClose: () => void;
}

export default function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasEmailAuth = user?.identities?.some(id => id.provider === 'email');

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (hasEmailAuth && !password) {
      setError('Please enter your password to confirm.');
      return;
    }

    if (!hasEmailAuth && confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm.');
      return;
    }

    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found.');
      }

      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ password: hasEmailAuth ? password : '' })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      await signOut();
      onClose();
      router.push('/');
      router.refresh();
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className={`modal-overlay open ${styles.overlay}`} role="dialog" aria-modal="true">
      <div className={`modal-box ${styles.box}`}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        
        <div className={styles.topBar} />
        
        <div className={styles.inner}>
          <div className={styles.iconWrap}>
            <AlertTriangle size={28} className={styles.alertIcon} />
          </div>

          <h2 className={styles.title}>Delete Account</h2>
          <p className={styles.subtitle}>
            Are you sure you want to permanently delete your account? This action <strong>cannot be undone</strong> and all your saved favourites will be lost.
          </p>

          {error && <div className={styles.errorBox}>{error}</div>}

          <form onSubmit={handleDelete} className={styles.form}>
            {hasEmailAuth ? (
              <div className={styles.field}>
                <label>Enter your password to confirm</label>
                <input 
                  type="password" 
                  className={`input ${styles.input}`} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
            ) : (
              <div className={styles.field}>
                <label>Type <strong>DELETE</strong> to confirm</label>
                <input 
                  type="text" 
                  className={`input ${styles.input}`} 
                  placeholder="DELETE" 
                  value={confirmText} 
                  onChange={e => setConfirmText(e.target.value)} 
                  required 
                />
              </div>
            )}
            
            <div className={styles.actions}>
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className={`btn ${styles.deleteBtn}`} disabled={loading || (!hasEmailAuth && confirmText !== 'DELETE')}>
                {loading ? <Loader2 size={16} className="spin" /> : 'Delete My Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
