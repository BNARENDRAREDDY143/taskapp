import React from 'react';
import { CheckCircle2, Clock, ListTodo, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

const DashboardStats = ({ stats, loading }) => {
  const {
    total = 0,
    todo = 0,
    inprogress = 0,
    completed = 0,
    overdue = 0,
    completionRate = 0
  } = stats || {};

  return (
    <div className="space-y-4">
      {/* Dynamic Overdue Alert Banner if tasks are past due */}
      {overdue > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/30 text-amber-950 dark:text-amber-200 backdrop-blur-md shadow-soft animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-glow-amber">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">
                Action Needed: <span className="underline">{overdue}</span> {overdue === 1 ? 'task has' : 'tasks have'} exceeded due dates!
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400/80">
                Prioritize these items to stay on track with project milestones.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of 4 Key Animated Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Tasks Card */}
        <div className="group relative p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          {/* Ambient Card Glow */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {loading ? '...' : total}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              all items
            </span>
          </div>

          {/* Progress track */}
          <div className="mt-4 relative z-10">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Overall Progress</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                style={{ width: `${Math.min(completionRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* To Do Card */}
        <div className="group relative p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-slate-400/10 dark:bg-slate-500/15 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              To Do Backlog
            </span>
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm group-hover:scale-110 transition-transform">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {loading ? '...' : todo}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              scheduled
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10">
            <span>Ready for execution</span>
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
          </div>
        </div>

        {/* In Progress Card */}
        <div className="group relative p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-sky-500/15 dark:bg-sky-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 shadow-sm group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {loading ? '...' : inprogress}
            </span>
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
              active now
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10">
            <span>Currently working</span>
            <span className="w-2 h-2 rounded-full bg-sky-500 shadow-glow animate-pulse" />
          </div>
        </div>

        {/* Completed Card */}
        <div className="group relative p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-emerald-500/15 dark:bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {loading ? '...' : completed}
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              achieved
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 relative z-10">
            <span>Delivered items</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-emerald animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
