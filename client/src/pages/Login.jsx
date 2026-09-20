import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CheckSquare, Lock, Mail, Eye, EyeOff, Sparkles, Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import GlowingWave from '../components/GlowingWave';

const Login = () => {
  const navigate = useNavigate();
  const { login, demoLogin, loading, authError, setAuthError } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const res = await login(email, password);
    if (res.success) {
      navigate('/home');
    }
  };

  const handleDemo = async () => {
    const res = await demoLogin();
    if (res.success) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 transition-colors relative overflow-hidden">
      {/* ── Glowing Wave Background (React Bits Pro style) ── */}
      <GlowingWave
        colors={[
          'rgba(99,102,241,0.95)',
          'rgba(139,92,246,0.80)',
          'rgba(14,165,233,0.70)',
          'rgba(168,85,247,0.60)',
        ]}
        opacity={0.60}
        blur={22}
        speed={14}
      />

      {/* Dark radial vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/70 pointer-events-none" />

      {/* Top Bar with back link & theme toggle */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </Link>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all shadow-sm"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl space-y-6 relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform">
              <CheckSquare className="w-7 h-7" />
            </div>
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome to TaskPro
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your home dashboard, boards, and tasks
          </p>
        </div>

        {/* Demo 1-Click Login Button */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-center space-y-2">
          <div className="text-xs font-semibold text-indigo-950 dark:text-indigo-200 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Fast Review & Testing</span>
          </div>
          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full py-2 px-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Demo 1-Click Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
            or sign in with email
          </span>
        </div>

        {/* Error Banner */}
        {authError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium">
            {authError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address / Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setAuthError(null);
                }}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(null);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>
            <span className="text-slate-400 cursor-not-allowed">Forgot Password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 rounded-xl shadow-md shadow-indigo-500/25 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
