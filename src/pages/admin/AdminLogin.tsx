import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { ChefHat, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-auto h-32 bg-transparent rounded-2xl flex items-center justify-center mx-auto mb-4">
            {/* <ChefHat size={32} className="text-white" /> */}
              <img src="https://babos.jaiveeru.site/uploads/gallery/logo-d.svg" alt="Babo's Home Kitchen" className="h-32 w-auto" />
          </div>
          {/* <h1 className="text-2xl font-bold text-white">Babo's Kitchen</h1> */}
          {/* <p className="text-stone-400 text-sm mt-1">Admin Panel</p> */}
        </div>

        <form onSubmit={handleSubmit} className="bg-stone-800 rounded-2xl p-6 space-y-4 border border-stone-700">
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1.5">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-900 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-9 pr-10 py-2.5 bg-stone-900 border border-stone-600 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-stone-500 text-xs mt-6">
          <Link to="https://jaiveeru.co.in" className="text-[rgb(252,179,22)] lg:text-stone-500 hover:text-white transition-colors">Powered by JaiVeeru Creatives</Link>
        </p>
      </div>
    </div>
  );
}
