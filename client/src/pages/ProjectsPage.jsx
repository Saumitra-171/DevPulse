import { useEffect, useState } from 'react';
import { Plus, FolderKanban, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  active: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  paused: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  archived: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)' },
};

function CreateProjectModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', description: '', repo_url: '', language: '', color: '#6366f1' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error('Name is required');
    setLoading(true);
    try {
      const { data } = await api.post('/projects', form);
      onCreate(data);
      toast.success('Project created!');
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to create project');
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
          New Project
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Name *</label>
            <input className="input" style={{ width: '100%' }} placeholder="My awesome project"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea className="input" style={{ width: '100%', resize: 'none' }} rows={3}
              placeholder="What is this project about?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Language</label>
              <input className="input" style={{ width: '100%' }} placeholder="TypeScript"
                value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Color</label>
              <input type="color" className="input" style={{ width: '100%', height: '40px', cursor: 'pointer', padding: '4px' }}
                value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Repository URL</label>
            <input className="input" style={{ width: '100%' }} placeholder="https://github.com/..."
              value={form.repo_url} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--color-surface-border)',
            background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px'
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ flex: 1, fontSize: '14px' }}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjects(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success('Project deleted');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Projects</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <Plus size={15} /> New Project
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="card" style={{ padding: '20px', height: '120px' }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
          <FolderKanban size={40} color="#334155" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8', fontWeight: 500 }}>No projects yet</p>
          <p style={{ fontSize: '14px', color: '#475569', marginTop: '4px', marginBottom: '16px' }}>
            Create your first project to start tracking activity.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary" style={{ fontSize: '14px' }}>
            Create Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {projects.map((p) => (
            <div key={p.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                  <Link to={`/projects/${p.id}`} style={{ fontWeight: 600, color: '#f1f5f9', textDecoration: 'none', fontSize: '15px' }}>
                    {p.name}
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {p.repo_url && (
                    <a href={p.repo_url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '4px', color: '#64748b', textDecoration: 'none' }}>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button onClick={() => handleDelete(p.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {p.description && (
                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px' }}>{p.description}</p>
              )}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '999px',
                  color: STATUS_COLORS[p.status]?.color, backgroundColor: STATUS_COLORS[p.status]?.bg,
                  border: `1px solid ${STATUS_COLORS[p.status]?.border}`
                }}>{p.status}</span>
                {p.language && (
                  <span style={{
                    fontSize: '11px', padding: '2px 8px', borderRadius: '999px',
                    color: '#94a3b8', backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-surface-border)'
                  }}>{p.language}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={(p) => setProjects((prev) => [p, ...prev])}
        />
      )}
    </div>
  );
}