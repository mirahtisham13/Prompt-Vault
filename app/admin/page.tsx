'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Zap, Plus, Edit2, Trash2, LogOut, BarChart2,
  Heart, Copy, Star, X, Save, ChevronDown, Tag
} from 'lucide-react';
import { Prompt } from '@/lib/types';
import { MOCK_PROMPTS, MOCK_CATEGORIES } from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import { PLATFORM_META, formatNumber } from '@/lib/utils';
import styles from './admin.module.css';

type Tab = 'prompts' | 'categories' | 'analytics';

const EMPTY_PROMPT: Omit<Prompt, 'id' | 'created_at' | 'likes' | 'copies'> = {
  title: '', text: '', category: '', platform: 'gemini',
  tags: [], image_url: '', is_featured: false,
};

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('prompts');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_PROMPT });
  const [tagInput, setTagInput] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }
      setAuthed(true);
      const { data } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
      if (data) setPrompts(data as Prompt[]);
    };
    checkAuthAndFetch();
  }, [router]);

  if (!authed) return null;

  // ── Stats ──────────────────────────────────────────────────
  const totalLikes  = prompts.reduce((s, p) => s + p.likes, 0);
  const totalCopies = prompts.reduce((s, p) => s + p.copies, 0);
  const featured    = prompts.filter(p => p.is_featured).length;

  // ── Form helpers ───────────────────────────────────────────
  const openNew = () => {
    setForm({ ...EMPTY_PROMPT });
    setEditingId(null);
    setTagInput('');
    setShowForm(true);
  };

  const openEdit = (p: Prompt) => {
    setForm({
      title: p.title, text: p.text, category: p.category,
      platform: p.platform, tags: [...p.tags], image_url: p.image_url ?? '',
      is_featured: p.is_featured,
    });
    setEditingId(p.id);
    setTagInput('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.text) return;
    if (editingId) {
      const { error } = await supabase.from('prompts').update(form).eq('id', editingId);
      if (!error) {
        setPrompts(prev => prev.map(p => p.id === editingId ? { ...p, ...form } : p));
      }
    } else {
      const { data, error } = await supabase.from('prompts').insert([{ ...form }]).select().single();
      if (!error && data) {
        setPrompts(prev => [data as Prompt, ...prev]);
      }
    }
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('prompts').delete().eq('id', id);
    if (!error) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
    setDeleteId(null);
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const filteredPrompts = prompts.filter(
    p => p.title.toLowerCase().includes(searchQ.toLowerCase()) ||
         p.category.toLowerCase().includes(searchQ.toLowerCase()) ||
         p.platform.toLowerCase().includes(searchQ.toLowerCase())
  );

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.sidebarLogo}>
          <span className={styles.logoIcon}><Zap size={18} /></span>
          <span>PromptVault</span>
        </Link>

        <nav className={styles.nav}>
          {([
            { id: 'prompts',    icon: <Tag size={16} />,       label: 'Prompts' },
            { id: 'categories', icon: <Star size={16} />,      label: 'Categories' },
            { id: 'analytics',  icon: <BarChart2 size={16} />, label: 'Analytics' },
          ] as { id: Tab; icon: React.ReactNode; label: string }[]).map(item => (
            <button
              key={item.id}
              className={`${styles.navItem} ${tab === item.id ? styles.navActive : ''}`}
              onClick={() => setTab(item.id)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>
              {tab === 'prompts' && 'Manage Prompts'}
              {tab === 'categories' && 'Manage Categories'}
              {tab === 'analytics' && 'Analytics'}
            </h1>
            <p className={styles.pageSubtitle}>PromptVault Admin Dashboard</p>
          </div>
          {tab === 'prompts' && (
            <button className="btn btn-primary" onClick={openNew}>
              <Plus size={16} /> Add Prompt
            </button>
          )}
        </div>

        {/* Stats row */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Prompts', value: prompts.length, icon: <Tag size={18} />, color: '#8b5cf6' },
            { label: 'Total Likes',   value: formatNumber(totalLikes),  icon: <Heart size={18} />, color: '#f43f5e' },
            { label: 'Total Copies',  value: formatNumber(totalCopies), icon: <Copy size={18} />,  color: '#06b6d4' },
            { label: 'Featured',      value: featured, icon: <Star size={18} />, color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statIcon} style={{ background: `${s.color}20`, color: s.color }}>
                {s.icon}
              </span>
              <div>
                <div className={styles.statValue}>{s.value}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Prompts Tab ── */}
        {tab === 'prompts' && (
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <input
                type="text"
                placeholder="Search prompts…"
                className={`input ${styles.searchInput}`}
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
              />
              <span className={styles.count}>{filteredPrompts.length} prompts</span>
            </div>

            <div className={styles.table}>
              <div className={styles.thead}>
                <span>Title</span>
                <span>Category</span>
                <span>Platform</span>
                <span>Likes</span>
                <span>Copies</span>
                <span>Featured</span>
                <span>Actions</span>
              </div>
              {filteredPrompts.map(p => {
                const plat = PLATFORM_META[p.platform];
                const cat  = MOCK_CATEGORIES.find(c => c.slug === p.category);
                return (
                  <div key={p.id} className={styles.trow}>
                    <span className={styles.tTitle}>{p.title}</span>
                    <span>
                      {cat ? <span>{cat.icon} {cat.name}</span> : p.category}
                    </span>
                    <span>
                      <span className={`badge`} style={{ background: `${plat?.color}20`, color: plat?.color, border: `1px solid ${plat?.color}40` }}>
                        {plat?.emoji} {plat?.label}
                      </span>
                    </span>
                    <span className={styles.statNum}><Heart size={12} /> {formatNumber(p.likes)}</span>
                    <span className={styles.statNum}><Copy size={12} /> {formatNumber(p.copies)}</span>
                    <span>
                      <span className={p.is_featured ? styles.yes : styles.no}>
                        {p.is_featured ? '⭐ Yes' : 'No'}
                      </span>
                    </span>
                    <span className={styles.rowActions}>
                      <button className={styles.editBtn} onClick={() => openEdit(p)} aria-label="Edit"><Edit2 size={14} /></button>
                      <button className={styles.delBtn} onClick={() => setDeleteId(p.id)} aria-label="Delete"><Trash2 size={14} /></button>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Categories Tab ── */}
        {tab === 'categories' && (
          <div className={styles.catGrid}>
            {MOCK_CATEGORIES.map(cat => (
              <div key={cat.id} className={styles.catCard} style={{ '--cat-c': cat.color } as React.CSSProperties}>
                <span className={styles.catIcon}>{cat.icon}</span>
                <div>
                  <div className={styles.catName}>{cat.name}</div>
                  <div className={styles.catCount}>
                    {prompts.filter(p => p.category === cat.slug).length} prompts
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Analytics Tab ── */}
        {tab === 'analytics' && (
          <div className={styles.analyticsGrid}>
            <div className={styles.analyticsCard}>
              <h3>Top Prompts by Likes</h3>
              {[...prompts].sort((a, b) => b.likes - a.likes).slice(0, 5).map((p, i) => (
                <div key={p.id} className={styles.analyticsRow}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <span className={styles.aTitle}>{p.title}</span>
                  <span className={styles.aVal}><Heart size={12} style={{ color: '#f43f5e' }} /> {formatNumber(p.likes)}</span>
                </div>
              ))}
            </div>
            <div className={styles.analyticsCard}>
              <h3>Top Prompts by Copies</h3>
              {[...prompts].sort((a, b) => b.copies - a.copies).slice(0, 5).map((p, i) => (
                <div key={p.id} className={styles.analyticsRow}>
                  <span className={styles.rank}>#{i + 1}</span>
                  <span className={styles.aTitle}>{p.title}</span>
                  <span className={styles.aVal}><Copy size={12} style={{ color: 'var(--accent)' }} /> {formatNumber(p.copies)}</span>
                </div>
              ))}
            </div>
            <div className={styles.analyticsCard}>
              <h3>Prompts by Platform</h3>
              {Object.entries(PLATFORM_META).filter(([k]) => k !== 'all').map(([key, meta]) => {
                const count = prompts.filter(p => p.platform === key).length;
                const pct = Math.round((count / prompts.length) * 100);
                return (
                  <div key={key} className={styles.barRow}>
                    <span className={styles.barLabel}>{meta.emoji} {meta.label}</span>
                    <div className={styles.bar}>
                      <div className={styles.barFill} style={{ width: `${pct}%`, background: meta.color }} />
                    </div>
                    <span className={styles.barCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── Prompt Form Modal ── */}
      {showForm && (
        <div className="modal-overlay open" onClick={() => setShowForm(false)}>
          <div className={`modal-box ${styles.formBox}`} onClick={e => e.stopPropagation()}>
            <div className={styles.formHeader}>
              <h2>{editingId ? 'Edit Prompt' : 'Add New Prompt'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowForm(false)}><X size={16} /></button>
            </div>

            <div className={styles.formBody}>
              <div className={styles.formField}>
                <label>Title *</label>
                <input className="input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Prompt title" />
              </div>
              <div className={styles.formField}>
                <label>Prompt Text *</label>
                <textarea
                  className={`input ${styles.textarea}`}
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="Full prompt text…"
                  rows={5}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Category</label>
                  <select className="input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Select category</option>
                    {MOCK_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Platform</label>
                  <select className="input" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))}>
                    {Object.entries(PLATFORM_META).filter(([k]) => k !== 'all').map(([k, v]) => (
                      <option key={k} value={k}>{v.emoji} {v.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formField}>
                <label>Image URL</label>
                <input className="input" value={form.image_url ?? ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://…" />
              </div>
              <div className={styles.formField}>
                <label>Tags</label>
                <div className={styles.tagInput}>
                  <input
                    className="input"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="Add tag and press Enter"
                  />
                  <button className="btn btn-ghost" onClick={addTag}>Add</button>
                </div>
                {form.tags.length > 0 && (
                  <div className={styles.tagsList}>
                    {form.tags.map(tag => (
                      <span key={tag} className={styles.tagChip}>
                        #{tag}
                        <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                />
                <span>Mark as Featured ⭐</span>
              </label>
            </div>

            <div className={styles.formFooter}>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.title || !form.text}>
                <Save size={15} /> {editingId ? 'Save Changes' : 'Create Prompt'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="modal-overlay open" onClick={() => setDeleteId(null)}>
          <div className={`modal-box ${styles.confirmBox}`} onClick={e => e.stopPropagation()}>
            <div className={styles.confirmIcon}><Trash2 size={24} /></div>
            <h3>Delete Prompt?</h3>
            <p>This action cannot be undone.</p>
            <div className={styles.confirmActions}>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
