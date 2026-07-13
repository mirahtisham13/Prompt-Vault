'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import { X, Copy, CheckCircle, Heart, Share2, Maximize2 } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { PLATFORM_META, copyToClipboard, formatNumber } from '@/lib/utils';
import { useToast } from './ToastProvider';
import { useAuth } from './AuthProvider';
import PromptFormatter from './PromptFormatter';
import styles from './PromptModal.module.css';

interface PromptModalProps { prompt: Prompt | null; onClose: () => void; onShare: (prompt: Prompt) => void; }

export default function PromptModal({ prompt, onClose, onShare }: PromptModalProps) {
  const { toast } = useToast();
  const { user, signInWithGoogle } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);
  const [textExpanded, setTextExpanded] = useState(false);
  const [varValues, setVarValues] = useState<Record<string, string>>({});
  const isOpen = !!prompt;

  const variables = useMemo(() => {
    if (!prompt) return [];
    const matches = prompt.text.match(/\[([^\]]+)\]/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map(m => m.slice(1, -1))));
  }, [prompt]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setImgExpanded(false);
      setTextExpanded(false);
      setVarValues({});
      setIsFav(false);
    }
  }, [isOpen]);

  const handleFavourite = async () => {
    if (!prompt) return;
    if (!user) { toast('Sign in to save favourites ❤️'); signInWithGoogle(); return; }
    setFavLoading(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      if (isFav) {
        await supabase.from('favourites').delete().eq('user_id', user.id).eq('prompt_id', prompt.id);
        setIsFav(false); toast('Removed from favourites');
      } else {
        await supabase.from('favourites').insert({ user_id: user.id, prompt_id: prompt.id });
        setIsFav(true); toast('Saved to favourites ❤️');
      }
    } catch { toast('Failed to update favourites', 'error'); }
    setFavLoading(false);
  };

  const getFinalText = () => {
    if (!prompt) return '';
    let text = prompt.text;
    variables.forEach(v => {
      if (varValues[v]) {
        text = text.replaceAll(`[${v}]`, varValues[v]);
      }
    });
    return text;
  };

  const handleCopy = async () => {
    if (!prompt) return;
    try { 
      await copyToClipboard(getFinalText()); 
      setCopied(true); 
      toast('Prompt copied! ✨'); 
      setTimeout(() => setCopied(false), 2500); 

      // Ping API to track copy
      fetch('/api/track-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId: prompt.id })
      }).catch(console.error);
    } catch { toast('Failed to copy', 'error'); }
  };

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal-box ${styles.box}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={18} /></button>
        {prompt.image_url && (
          <div className={`${styles.imageWrap} ${imgExpanded ? styles.expanded : ''}`}>
            <img src={prompt.image_url} alt={prompt.title} className={styles.image} onClick={() => setImgExpanded(p => !p)} />
            <button className={styles.expandBtn} onClick={() => setImgExpanded(p => !p)}>
              <Maximize2 size={14} />{imgExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.badges}>
            {prompt.is_premium && <span className={`badge ${styles.premiumBadge}`}>👑 Premium</span>}
          </div>
          <h2 className={styles.title}>{prompt.title}</h2>
          
          {variables.length > 0 && (
            <div className={styles.variablesBox}>
              <h3 className={styles.varTitle}>Customize Prompt</h3>
              <div className={styles.varList}>
                {variables.map(v => (
                  <div key={v} className={styles.varField}>
                    <label className={styles.varLabel}>{v}</label>
                    <input 
                      type="text" 
                      className={`input ${styles.varInput}`} 
                      placeholder={`Enter ${v.toLowerCase()}...`}
                      value={varValues[v] || ''}
                      onChange={e => setVarValues(p => ({ ...p, [v]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div 
            className={`${styles.promptBox} ${textExpanded ? styles.expandedText : ''}`} 
            onClick={() => setTextExpanded(p => !p)}
            title="Tap to expand text"
          >
            <p className={styles.promptText}>
              <PromptFormatter text={prompt.text} values={varValues} />
            </p>
            {!textExpanded && (
              <div className={styles.textFade}>
                <span className={styles.textExpandHint}>Tap to read more</span>
              </div>
            )}
          </div>
          {prompt.tags?.length > 0 && <div className={styles.tags}>{prompt.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}</div>}
          <div className={styles.stats}>
            <span className={styles.stat}><Heart size={13} fill="currentColor" style={{ color: '#f43f5e' }} />{formatNumber(prompt.likes)} likes</span>
            <span className={styles.stat}><Copy size={13} style={{ color: 'var(--accent)' }} />{formatNumber(prompt.copies)} copies</span>
          </div>
          <div className={styles.actions}>
            <button className={`btn btn-primary ${styles.copyBtn}`} onClick={handleCopy}>{copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy Prompt</>}</button>
            <button
              className={`btn btn-ghost ${styles.likeBtn} ${isFav ? styles.liked : ''}`}
              onClick={handleFavourite}
              disabled={favLoading}
              title={!user ? 'Sign in to save favourites' : (isFav ? 'Remove from favourites' : 'Save to favourites')}
            >
              <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            <button className="btn btn-ghost" onClick={() => onShare(prompt)}><Share2 size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
