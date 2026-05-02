import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Activity,
  BarChart3, Settings, Zap, LogOut
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/activity', icon: Activity, label: 'Activity' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside style={{
      width: '240px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-surface-card)',
      borderRight: '1px solid var(--color-surface-border)',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '20px', borderBottom: '1px solid var(--color-surface-border)'
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          backgroundColor: 'var(--color-brand-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Zap size={16} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '18px', color: 'white' }}>DevPulse</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px' }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', borderRadius: '8px',
              marginBottom: '4px', textDecoration: 'none',
              fontSize: '14px', fontWeight: 500,
              backgroundColor: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: isActive ? 'var(--color-brand-400)' : '#94a3b8',
              border: isActive ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--color-surface-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: 'rgba(99,102,241,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-brand-400)', fontWeight: 700, fontSize: '14px'
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#f1f5f9' }}>{user?.username}</p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>{user?.role}</p>
          </div>
          <button onClick={logout} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', padding: '4px'
          }} title="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}