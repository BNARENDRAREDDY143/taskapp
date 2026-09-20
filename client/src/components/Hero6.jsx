import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Kanban,
  Plus,
  TrendingUp,
  Filter,
  CheckCircle2,
  Clock,
  ListTodo,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: 'Fluid Kanban Workflow',
    title: 'Effortless Task Management for High-Velocity Execution',
    subtitle: 'Drag, drop, and synchronize your tasks across To Do, In Progress, and Completed columns with real-time feedback.',
    tagline: '01 / 03 • WORKSPACE BOARDS',
    accentColor: 'from-indigo-600 via-purple-600 to-sky-500',
    borderColor: 'border-indigo-500/30',
    ctaPrimary: 'Open Task Board',
    ctaSecondary: 'Create New Task',
    actionType: 'board',
    previewType: 'kanban'
  },
  {
    id: 2,
    badge: 'Real-Time Analytics & Tracking',
    title: 'Monitor Completion Rates, Overdue Deadlines & Backlogs',
    subtitle: 'Stay ahead of delivery dates with automated overdue alerts, visual completion progress bars, and priority breakdowns.',
    tagline: '02 / 03 • PERFORMANCE METRICS',
    accentColor: 'from-sky-500 via-indigo-600 to-emerald-500',
    borderColor: 'border-sky-500/30',
    ctaPrimary: 'View Task Stats',
    ctaSecondary: 'Explore Board',
    actionType: 'stats',
    previewType: 'stats'
  },
  {
    id: 3,
    badge: 'Multi-Faceted Search Engine',
    title: 'Instant Filter & Priority-Based Project Categorization',
    subtitle: 'Switch seamlessly between Kanban drag-and-drop and sortable List views with multi-category filters and keyword search.',
    tagline: '03 / 03 • SEARCH & ORGANIZATION',
    accentColor: 'from-emerald-500 via-teal-600 to-indigo-600',
    borderColor: 'border-emerald-500/30',
    ctaPrimary: 'Filter & Search Tasks',
    ctaSecondary: 'Create Task',
    actionType: 'filter',
    previewType: 'filter'
  }
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

const Hero6 = ({
  user,
  stats,
  memberSince,
  lastLoginFormatted,
  onOpenCreateModal
}) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Auto-rotation with vertical progress increment
  useEffect(() => {
    if (isPaused) {
      clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const updateRate = 50; // ms
    const step = (updateRate / AUTOPLAY_INTERVAL) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, updateRate);

    return () => {
      clearInterval(progressIntervalRef.current);
    };
  }, [currentSlide, isPaused]);

  const handleSelectSlide = (idx) => {
    setCurrentSlide(idx);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentSlide((curr) => (curr + 1) % slides.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlide((curr) => (curr - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const slide = slides[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
      style={{ minHeight: 'calc(100vh - 64px)' }}
    >
      {/* Dynamic Ambient Glow Behind Current Slide */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none transition-all duration-700 animate-float-slow" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none transition-all duration-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/5 dark:bg-sky-600/8 rounded-full blur-3xl pointer-events-none" />

      {/* Full-height flex wrapper */}
      <div className="flex flex-col justify-between h-full" style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* Top Meta Bar */}
      <div className="relative z-10 px-8 sm:px-16 lg:px-24 pt-8 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm font-bold text-xs">
            TP
          </div>
          <div>
            <span className="text-xs font-black tracking-tight uppercase text-indigo-600 dark:text-indigo-400">
              {slide.tagline}
            </span>
          </div>
        </div>

        {/* Member Status Pill */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>User: <strong className="text-slate-800 dark:text-slate-200">{user?.name}</strong></span>
          <span>•</span>
          <span>Last login: <strong className="text-slate-800 dark:text-slate-200">Today at {lastLoginFormatted}</strong></span>
        </div>
      </div>

      {/* Main Slide Carousel Area */}
      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 px-8 sm:px-16 lg:px-24 py-10 lg:py-14 items-center">
        {/* Left: Vertical Progress Line & Slide Number Navigation */}
        <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center h-full py-4 space-y-6">
          {slides.map((s, idx) => {
            const isActive = currentSlide === idx;
            return (
              <div key={s.id} className="flex flex-col items-center group cursor-pointer" onClick={() => handleSelectSlide(idx)}>
                <button
                  className={`text-xs font-black transition-all ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 scale-125'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  0{s.id}
                </button>

                {/* Vertical Track Segment */}
                {idx < slides.length && (
                  <div className="relative w-0.5 h-14 bg-slate-200 dark:bg-slate-800 my-1 rounded-full overflow-hidden">
                    {isActive && (
                      <div
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-600 to-purple-600 transition-all duration-100 ease-linear rounded-full"
                        style={{ height: `${progress}%` }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Middle: Slide Text, Headline & Action Buttons */}
        <div className="lg:col-span-6 space-y-6 animate-fade-in key={currentSlide}">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{slide.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/tasks')}
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2.5 group"
            >
              <Kanban className="w-5 h-5" />
              <span>{slide.ctaPrimary}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenCreateModal}
              className="px-8 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 active:scale-95 transition-all flex items-center gap-2.5"
            >
              <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{slide.ctaSecondary}</span>
            </button>
          </div>
        </div>

        {/* Right: Interactive Live Visual Widget per Slide */}
        <div className="lg:col-span-5 relative">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden group">
            {/* Ambient Corner Flare */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Slide 1 Widget: Kanban Preview */}
            {slide.previewType === 'kanban' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Kanban className="w-4 h-4 text-indigo-600" />
                    <span>Live Board Stream</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    3 Columns
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">High Priority</span>
                      <p className="text-xs font-bold mt-1 text-slate-900 dark:text-white">Full-Stack Security Audit</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      To Do
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-sky-300/70 dark:border-sky-800/70 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">Medium</span>
                      <p className="text-xs font-bold mt-1 text-slate-900 dark:text-white">React Bits Hero Carousel</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                      In Progress
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300/70 dark:border-emerald-800/70 shadow-sm flex items-center justify-between opacity-85">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">Achieved</span>
                      <p className="text-xs font-bold mt-1 line-through text-slate-400 dark:text-slate-500">JWT Token Middleware Setup</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Done
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2 Widget: Performance Metrics */}
            {slide.previewType === 'stats' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <span>Real-Time Productivity</span>
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                    {stats?.completionRate || 0}% Complete
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-400 font-medium">Total Tracked</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stats?.total || 0}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-emerald-600 font-medium">Completed</span>
                    <p className="text-2xl font-black text-emerald-600 mt-0.5">{stats?.completed || 0}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Overall Project Progress</span>
                    <span className="text-indigo-600 dark:text-indigo-400">{stats?.completionRate || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 h-full rounded-full transition-all duration-700"
                      style={{ width: `${stats?.completionRate || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Slide 3 Widget: Search & Filters Preview */}
            {slide.previewType === 'filter' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-emerald-600" />
                    <span>Instant Category Engine</span>
                  </span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                    Active Filters
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-bold text-[11px] shadow-sm">All Priorities</span>
                    <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[11px] border border-rose-200 dark:border-rose-900">High Priority</span>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[11px] border border-amber-200 dark:border-amber-900">Medium</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Search query: <strong className="text-indigo-600 dark:text-indigo-400">"API"</strong></span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded font-bold">2 Matches</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Sort by Due Date, Priority, or Creation Date instantly.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-10 px-8 sm:px-16 lg:px-24 py-5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        {/* Slide navigation dots for mobile / desktop */}
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleSelectSlide(idx)}
              aria-label={`Go to slide ${s.id}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                  : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
              }`}
            />
          ))}
          <span className="ml-2 text-xs text-slate-400 font-bold">
            0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors shadow-sm active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next Slide"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors shadow-sm active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      </div> {/* end full-height flex wrapper */}
    </div>
  );
};

export default Hero6;
