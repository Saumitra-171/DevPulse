import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

export default function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header style={{
      height: '56px',
      backgroundColor: 'var(--color-surface-card)',
      borderBottom: '1px solid var(--color-surface-border)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        borderRadius: '8px', padding: '6px 12px', width: '280px'
      }}>
        <input
          type="text"
          placeholder="Search projects, activity..."
          style={{
            background: 'none', border: 'none', outline: 'none',
            fontSize: '14px', color: '#cbd5e1', width: '100%'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#94a3b8', padding: '8px', borderRadius: '8px'
        }}>
          <Bell size={17} />
        </button>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          backgroundColor: 'rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-brand-400)', fontWeight: 700, fontSize: '14px'
        }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}