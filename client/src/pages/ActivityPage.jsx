import { useState, useEffect } from 'react';
import { Plus, Activity } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const EVENT_TYPES = ['commit', 'deploy', 'review', 'bug_fix', 'feature', 'refactor', 'docs', 'test'];
const EVENT_ICONS = {
  commit: '📝', deploy: '🚀', review: '👀', bug_fix: '🐛',
  feature: '✨', refactor: '♻️', docs: '📚', test: '🧪', default: '⚡',
};

function LogEventModal({ onClose, onLog }) {
  const [form, setForm] = useState({ type: 'commit', title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    setLoading(true);
    try {
      const { data } = await api.post('/activity', form);
      onLog(data);
      toast.success('Activity logged!');
      onClose();
    } catch {
      toast.error('Failed to log activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
          Log Activity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Type</label>
            <select className="input" style={{ width: '100%' }}
              value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Title *</label>
            <input className="input" style={{ width: '100%' }} placeholder="What did you do?"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea className="input" style={{ width: '100%', resize: 'none' }} rows={3}
              placeholder="More details..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '8px', borderRadius: '8px',
            border: '1px solid var(--color-surface-border)',
            background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px'
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ flex: 1, fontSize: '14px' }}>
            {loading ? 'Logging...' : 'Log Activity'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/activity').then(({ data }) => setActivities(data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
  const handler = (e) => setActivities((prev) => [e.detail, ...prev]);
  window.addEventListener('activity:new', handler);
  return () => window.removeEventListener('activity:new', handler);
}, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Activity Feed</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>All your developer events.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <Plus size={15} /> Log Event
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ padding: '16px', borderBottom: '1px solid var(--color-surface-border)', display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface-border)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: '14px', background: 'var(--color-surface-border)', borderRadius: '4px', width: '50%', marginBottom: '8px' }} />
                <div style={{ height: '12px', background: 'var(--color-surface-border)', borderRadius: '4px', width: '30%' }} />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <Activity size={36} color="#334155" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#94a3b8' }}>No activity yet. Log your first event!</p>
          </div>
        ) : (
          activities.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px',
              borderBottom: i < activities.length - 1 ? '1px solid var(--color-surface-border)' : 'none',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--color-surface)', border: '1px solid var(--color-surface-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
              }}>
                {EVENT_ICONS[a.type] || EVENT_ICONS.default}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#f1f5f9' }}>{a.title}</p>
                  <span style={{ fontSize: '12px', color: '#475569', flexShrink: 0 }}>
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </span>
                </div>
                {a.description && (
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{a.description}</p>
                )}
                <span style={{
                  display: 'inline-block', marginTop: '6px', fontSize: '11px', padding: '2px 8px',
                  borderRadius: '999px', color: '#94a3b8',
                  background: 'var(--color-surface)', border: '1px solid var(--color-surface-border)'
                }}>{a.type.replace('_', ' ')}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <LogEventModal
          onClose={() => setShowModal(false)}
          onLog={() => {}}
        />
      )}
    </div>
  );
}