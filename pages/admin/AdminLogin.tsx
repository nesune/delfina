import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Props {
  onLogin: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (data.user) {
        // Successfully logged in
        onLogin();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
      <div className="bg-white p-10 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-serif text-center mb-8">{t('admin.login')}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-500 mb-2">
              {t('admin.email') || 'Email'}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border p-3 outline-none focus:border-gold"
              placeholder="admin@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-500 mb-2">{t('admin.password')}</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-3 outline-none focus:border-gold"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm rounded">
              {error}
            </div>
          )}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 text-white py-3 uppercase tracking-widest hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
