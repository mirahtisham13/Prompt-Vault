'use client';
import { useState } from 'react';
import { X, Share2, MessageCircle, Copy, CheckCircle, Link } from 'lucide-react';
import { Prompt } from '@/lib/types';
import { getShareUrls, copyToClipboard } from '@/lib/utils';
import { useToast } from './ToastProvider';
import styles from './ShareModal.module.css';

interface ShareModalProps { prompt: Prompt | null; onClose: () => void; }

export default function ShareModal({ prompt, onClose }: ShareModalProps) {
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);
  const isOpen = !!prompt;
  if (!isOpen) return null;

  const pageUrl = typeof window !== 'undefined' ? `${window.location.origin}/prompt/${prompt.id}` : `https://promptbytes.app/prompt/${prompt.id}`;
  const urls = getShareUrls(pageUrl, prompt.text);

  const handleCopyLink = async () => {
    try { await copyToClipboard(pageUrl); setCopiedLink(true); toast('Link copied! 🔗'); setTimeout(() => setCopiedLink(false), 2000); }
    catch { toast('Failed to copy', 'error'); }
  };

  const shareOptions = [
    { label: 'Twitter / X', icon: <Share2 size={18} />, color: '#1d9bf0', onClick: () => window.open(urls.twitter, '_blank', 'noopener') },
    { label: 'WhatsApp', icon: <MessageCircle size={18} />, color: '#25d366', onClick: () => window.open(urls.whatsapp, '_blank', 'noopener') },
    { label: copiedLink ? 'Link Copied!' : 'Copy Link', icon: copiedLink ? <CheckCircle size={18} /> : <Link size={18} />, color: copiedLink ? '#10b981' : 'var(--text-secondary)', onClick: handleCopyLink },
  ];

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} role="dialog" aria-modal="true">
      <div className={`modal-box ${styles.box}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close"><X size={16} /></button>
        <div className={styles.content}>
          <h3 className={styles.title}>Share this Prompt</h3>
          <p className={styles.subtitle}>{prompt.title}</p>
          <div className={styles.options}>
            {shareOptions.map(opt => (
              <button key={opt.label} className={styles.option} onClick={opt.onClick} style={{ '--opt-color': opt.color } as React.CSSProperties}>
                <span className={styles.optIcon} style={{ color: opt.color }}>{opt.icon}</span>
                <span className={styles.optLabel}>{opt.label}</span>
              </button>
            ))}
          </div>
          <div className={styles.urlBox}>
            <span className={styles.url}>{pageUrl}</span>
            <button className={styles.urlCopy} onClick={handleCopyLink}>{copiedLink ? <CheckCircle size={14} /> : <Copy size={14} />}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
