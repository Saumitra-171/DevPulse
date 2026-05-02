import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">DevPulse</span>
        </div>

        <div className="card p-7">
          <h1 className="text-xl font-semibold text-slate-100 mb-1">Sign in</h1>
          <p className="text-sm text-slate-500 mb-6">Welcome back to your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
              <input
                type="email"
                className="input w-full"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Password</label>
              <input
                type="password"
                className="input w-full"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          No account?{' '}
          <Link to="/register" className="text-brand-400 hover:text-brand-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}