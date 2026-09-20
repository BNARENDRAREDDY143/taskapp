import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  CheckSquare,
  Sparkles,
  ArrowRight,
  Kanban,
  TrendingUp,
  Clock,
  ShieldCheck,
  Moon,
  Sun,
  CheckCircle2,
  ListTodo,
  Layers
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { demoLogin, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleDemo = async () => {
    const res = await demoLogin();
    if (res.success) {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-slate-900 dark:text-white transition-colors relative overflow-hidden bg-grid-pattern">
      {/* Background Lighting Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-float-delayed" />

      {/* Public Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-200 bg-clip-text text-transparent">
                TaskPro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-500/20 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen MERN Task Management Experience</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] animate-fade-in">
          Master Your Workflow with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">
            Intelligent Task Boards
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transform chaotic backlogs into clear execution. Organize tasks by status, manage priorities, visualize progress on Kanban boards, and meet every milestone.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl shadow-lg shadow-indigo-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 rounded-2xl shadow-soft hover:shadow-card active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{loading ? 'Launching Demo...' : 'Explore Instant Demo'}</span>
          </button>
        </div>

        {/* Live App Mockup Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-indigo-500/20 via-slate-200/40 dark:via-slate-800/40 to-transparent border border-indigo-200/50 dark:border-indigo-800/30 shadow-2xl backdrop-blur-md">
          <div className="rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-inner text-left">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs font-semibold text-slate-400">TaskPro Workspace Board</span>
              </div>
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                Active Session
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Demo Col 1 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs font-bold mb-3 text-slate-700 dark:text-slate-300">
                  <span>To Do</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">1</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">High</span>
                  <p className="text-xs font-bold mt-1 text-slate-900 dark:text-white">Security Vulnerability Audit</p>
                  <span className="text-[11px] text-slate-400 mt-2 block">Due Oct 4</span>
                </div>
              </div>

              {/* Demo Col 2 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs font-bold mb-3 text-slate-700 dark:text-slate-300">
                  <span>In Progress</span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px]">1</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">Medium</span>
                  <p className="text-xs font-bold mt-1 text-slate-900 dark:text-white">Interactive Kanban Animation</p>
                  <span className="text-[11px] text-slate-400 mt-2 block">Active Work</span>
                </div>
              </div>

              {/* Demo Col 3 */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs font-bold mb-3 text-slate-700 dark:text-slate-300">
                  <span>Completed</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">1</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm opacity-90">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">Achieved</span>
                  <p className="text-xs font-bold mt-1 line-through text-slate-400 dark:text-slate-500">Express RESTful API Architecture</p>
                  <span className="text-[11px] text-emerald-600 mt-2 block font-semibold">Done Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Designed for Speed and Clarity
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Every feature is engineered to streamline how teams organize, prioritize, and execute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fluid Kanban Board</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Drag-and-drop tasks between To Do, In Progress, and Completed columns with instant optimistic UI updates and live counters.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 shadow-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Metrics & Deadlines</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Track overall progress percentage, active workloads, and receive instant alert banners when tasks become overdue.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Secure JWT Authentication</h3>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Protected routes, bcrypt hashed credentials, and persistent sessions ensure your project data is private and always accessible.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 TaskPro — Full-Stack MERN Task & Project Management. Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
