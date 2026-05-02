import { useEffect, useState } from 'react';
import { GitCommit, Clock, Flame, FolderOpen, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';
import { useAuthStore } from '../store/auth.store';

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="card p-5" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
    <div style={{
      width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
      backgroundColor: `${color}20`, border: `1px solid ${color}40`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={18} color={color} />
    </div>
    <div>
      <p style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>{value}</p>
      <p style={{ fontSize: '14px', color: '#94a3b8' }}>{label}</p>
      {sub && <p style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{sub}</p>}
    </div>
  </div>
);

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [overview, setOverview] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);

  useEffect(() => {
    api.get('/stats/overview').then(({ data }) => setOverview(data)).catch(() => {});
    api.get('/stats/daily?days=14').then(({ data }) => setDailyStats(data)).catch(() => {});
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>
          Good {greeting()}, {user?.username} 👋
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard
          icon={FolderOpen} label="Active Projects"
          value={overview?.projects?.active ?? '0'}
          sub={`${overview?.projects?.total ?? 0} total`}
          color="#6366f1"
        />
        <StatCard
          icon={GitCommit} label="Commits Today"
          value={overview?.today?.commits ?? 0}
          color="#10b981"
        />
        <StatCard
          icon={Clock} label="Active Time"
          value={`${overview?.today?.active_time_minutes ?? 0}m`}
          sub="today" color="#f59e0b"
        />
        <StatCard
          icon={Flame} label="Day Streak"
          value={overview?.currentStreak ?? 0}
          sub="consecutive days" color="#ef4444"
        />
      </div>

      {/* Chart */}
      <div className="card p-5">
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={15} color="#6366f1" /> Activity (14 days)
        </h2>
        {dailyStats.length === 0 ? (
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
            No data yet — start logging activity!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyStats}>
              <CartesianGrid stroke="#1e2535" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Line type="monotone" dataKey="events_count" stroke="#6366f1" strokeWidth={2} dot={false} name="Events" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={15} color="#6366f1" /> Recent Activity
        </h2>
        <div style={{ color: '#475569', fontSize: '14px', textAlign: 'center', padding: '24px' }}>
          No activity yet — go to the Activity page to log your first event!
        </div>
      </div>
    </div>
  );
}