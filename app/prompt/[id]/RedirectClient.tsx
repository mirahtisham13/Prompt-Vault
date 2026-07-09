'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RedirectClient({ id }: { id: string }) {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to homepage and open the modal
    router.replace(`/?prompt=${id}`);
  }, [id, router]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
      <Loader2 size={32} style={{ marginBottom: '16px', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontFamily: 'system-ui, sans-serif' }}>Loading prompt...</p>
    </div>
  );
}
