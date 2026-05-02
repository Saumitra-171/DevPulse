import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../services/api';
import { format, subDays, eachDayOfInterval } from 'date-fns';

export default function StatsPage() {
  const [daily, setDaily] = useState([]);
  const [heatmap, setHeatmap] = useState([]);

  useEffect(() => {
    api.get('/stats/daily?days=30').then(({ data }) => setDaily(data)).catch(() => {});
    api.get('/stats/heatmap').then(({ data }) => setHeatmap(data)).catch(() => {});
  }, []);

  const heatmapMap = Object.fromEntries(heatmap.map((d) => [d.date, d.count]));
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 364), end: today });

  const getColor = (count) => {
    if (!count || count === 0) return 'var(--color-surface-border)';
    if (count < 3) return 'rgba(99,102,241,0.3)';
    if (count < 6) return 'rgba(99,102,241,0.6)';
    return 'var(--color-brand-500)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Stats</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Your development patterns over time.</p>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
          Activity Heatmap
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '3px', minWidth: 'max-content' }}>
            {Array.from({ length: 52 }, (_, weekIdx) => (
              <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {days.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => {
                  const key = format(day, 'yyyy-MM-dd');
                  const count = heatmapMap[key] || 0;
                  return (
                    <div key={key} title={`${key}: ${count} events`} style={{
                      width: '12px', height: '12px', borderRadius: '2px',
                      backgroundColor: getColor(count), cursor: 'pointer',
                    }} />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: '#475569' }}>Less</span>
          {['var(--color-surface-border)', 'rgba(99,102,241,0.3)', 'rgba(99,102,241,0.6)', 'var(--color-brand-500)'].map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: c }} />
          ))}
          <span style={{ fontSize: '12px', color: '#475569' }}>More</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
          Daily Events (30 days)
        </h2>
        {daily.length === 0 ? (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
            No data yet — start logging activity!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={daily} barSize={10}>
              <CartesianGrid stroke="#1e2535" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#161b27', border: '1px solid #1e2535', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Bar dataKey="events_count" fill="#6366f1" radius={[3, 3, 0, 0]} name="Events" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}