'use client';
import { useState } from 'react';
import { X, Copy, CheckCircle, Heart, Star, Share2, Maximize2 } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { MOCK_CATEGORIES } from '@/lib/mockData';
import { PLATFORM_META, copyToClipboard, formatNumber } from '@/lib/utils';
import { useToast } from './ToastProvider';
import styles from './PromptModal.module.css';

interface PromptModalProps { prompt: Prompt | null; onClose: () => void; onShare: (prompt: Prompt) => void; }

export default function PromptModal({ prompt, onClose, onShare }: PromptModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);
  const isOpen = !!prompt;

  const handleCopy = async () => {
    if (!prompt) return;
    try { await copyToClipboard(prompt.text); setCopied(true); toast('Prompt copied! ✨'); setTimeout(() => setCopied(false), 2500); }
    catch { toast('Failed to copy', 'error'); }
  };

  if (!isOpen) return null;
  const platform = PLATFORM_META[prompt.platform] ?? PLATFORM_META['gemini'];
  const category = MOCK_CATEGORIES.find(c => c.slug === prompt.category);

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
            {prompt.is_featured && <span className={`badge ${styles.featuredBadge}`}><Star size={10} fill="currentColor" /> Featured</span>}
            {category && <span className={`badge ${styles.catBadge}`} style={{ '--cat-color': category.color } as React.CSSProperties}>{category.icon} {category.name}</span>}
            <span className={`badge ${styles.platBadge}`} style={{ '--p-color': platform.color } as React.CSSProperties}>{platform.emoji} {platform.label}</span>
          </div>
          <h2 className={styles.title}>{prompt.title}</h2>
          <div className={styles.promptBox}><p className={styles.promptText}>{prompt.text}</p></div>
          {prompt.tags?.length > 0 && <div className={styles.tags}>{prompt.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}</div>}
          <div className={styles.stats}>
            <span className={styles.stat}><Heart size={13} fill="currentColor" style={{ color: '#f43f5e' }} />{formatNumber(prompt.likes)} likes</span>
            <span className={styles.stat}><Copy size={13} style={{ color: 'var(--accent)' }} />{formatNumber(prompt.copies)} copies</span>
          </div>
          <div className={styles.actions}>
            <button className={`btn btn-primary ${styles.copyBtn}`} onClick={handleCopy}>{copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy Prompt</>}</button>
            <button className={`btn btn-ghost ${styles.likeBtn} ${liked ? styles.liked : ''}`} onClick={() => setLiked(p => !p)}><Heart size={16} fill={liked ? 'currentColor' : 'none'} /></button>
            <button className="btn btn-ghost" onClick={() => onShare(prompt)}><Share2 size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
