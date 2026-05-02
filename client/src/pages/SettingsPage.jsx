import { useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Copy, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ username: user?.username || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/users/profile', form);
      setUser(data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f1f5f9' }}>Settings</h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>Manage your profile and preferences.</p>
      </div>

      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>Profile</h2>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Username</label>
          <input className="input" style={{ width: '100%' }} value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Email</label>
          <input className="input" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
            value={user?.email} disabled />
          <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Email cannot be changed.</p>
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Bio</label>
          <textarea className="input" style={{ width: '100%', resize: 'none' }} rows={3}
            placeholder="Tell us about yourself..."
            value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: '14px', alignSelf: 'flex-start' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}