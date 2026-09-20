import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Kanban, Plus, TrendingUp,
  ChevronLeft, ChevronRight, Filter, CheckCircle2,
  Clock, ListTodo, Tag
} from 'lucide-react';

/* ─── Blur Text Reveal (word-by-word) ─────────────────────────────── */
export const BlurTextReveal = ({ text, className = '', delay = 0, duration = 0.85 }) => {
  const words = text.split(' ');
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.35em] ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block animate-blur-word"
          style={{
            animationDelay: `${delay + i * 0.08}s`,
            animationDuration: `${duration}s`,
            animationFillMode: 'forwards',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

/* ─── Slide data (re-used from Hero 6 logic) ──────────────────────── */
const slides = [
  {
    id: 1,
    badge: 'Fluid Kanban Workflow',
    title: 'Effortless Task Management for High-Velocity Teams',
    subtitle: 'Drag, drop, and synchronize tasks across To Do, In Progress, and Completed with real-time feedback.',
    tagline: '01 / 03',
    ctaPrimary: 'Open Task Board',
    ctaRoute: '/tasks',
    ctaSecondary: 'Create New Task',
    previewType: 'kanban',
  },
  {
    id: 2,
    badge: 'Real-Time Analytics',
    title: 'Monitor Completion Rates, Deadlines & Backlogs',
    subtitle: 'Stay ahead of delivery dates with automated overdue alerts, visual progress bars, and priority breakdowns.',
    tagline: '02 / 03',
    ctaPrimary: 'View Dashboard',
    ctaRoute: '/dashboard',
    ctaSecondary: 'Create New Task',
    previewType: 'stats',
  },
  {
    id: 3,
    badge: 'Multi-Faceted Search',
    title: 'Instant Filter & Priority-Based Project Categorization',
    subtitle: 'Switch between Kanban and List views with multi-category filters and keyword search in milliseconds.',
    tagline: '03 / 03',
    ctaPrimary: 'Filter & Search',
    ctaRoute: '/dashboard',
    ctaSecondary: 'Create New Task',
    previewType: 'filter',
  },
];

const AUTOPLAY = 7000;

/* ─── Main Hero9 Component ────────────────────────────────────────── */
const Hero9 = ({ user, stats, memberSince, lastLoginFormatted, onOpenCreateModal }) => {
  const navigate = useNavigate();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressRef = useRef(null);

  /* ── Auto-rotation with progress bar ─────────────────────────── */
  useEffect(() => {
    if (isPaused) {
      clearInterval(progressRef.current);
      return;
    }
    setProgress(0);
    const rate = 50;
    const step = (rate / AUTOPLAY) * 100;
    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((c) => (c + 1) % slides.length);
          return 0;
        }
        return prev + step;
      });
    }, rate);
    return () => clearInterval(progressRef.current);
  }, [currentSlide, isPaused]);

  const goTo = (idx) => { setCurrentSlide(idx); setProgress(0); };
  const next = () => goTo((currentSlide + 1) % slides.length);
  const prev = () => goTo((currentSlide - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  /* ── Video sources (multiple CDN fallbacks) ───────────────────── */
  const videoSources = [
    'https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-purple-and-blue-neon-lights-42999-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-glowing-purple-particles-on-dark-background-42990-large.mp4',
  ];

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-950 text-white"
      style={{ minHeight: 'calc(100vh - 64px)' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ══════════════════════════════════════════════════════════
          1. FULL-SCREEN VIDEO BACKGROUND
      ══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-[2000ms] ${
            videoLoaded ? 'opacity-50' : 'opacity-0'
          }`}
        >
          {videoSources.map((src, i) => (
            <source key={i} src={src} type="video/mp4" />
          ))}
        </video>

        {/* Fallback animated gradient mesh while video loads */}
        <div
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            background:
              'radial-gradient(ellipse at 20% 50%, #4f46e5 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #7c3aed 0%, transparent 60%), radial-gradient(ellipse at 60% 80%, #0ea5e9 0%, transparent 60%), #030712',
            animation: 'pulse 6s ease-in-out infinite alternate',
          }}
        />

        {/* Overlay layers for cinematic depth */}
        {/* Darkening vignette from left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30" />
        {/* Top & bottom fade to black */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80" />
        {/* Ambient color tinting */}
        <div className="absolute inset-0 bg-indigo-950/30 mix-blend-multiply" />

        {/* Floating glow spheres */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[80px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-600/10 rounded-full blur-[120px]" />
      </div>

      {/* ══════════════════════════════════════════════════════════
          2. MAIN CONTENT (vertical layout filling viewport)
      ══════════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex flex-col"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {/* Top meta bar */}
        <div className="px-8 sm:px-16 lg:px-24 pt-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-600/40">
              TP
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-indigo-400">
              {slide.tagline} &nbsp;•&nbsp; TaskPro Dashboard
            </span>
          </div>

          {/* Slide dots — top bar */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-white/50 font-medium">
            <span>
              Welcome, <strong className="text-white">{user?.name || 'User'}</strong>
            </span>
            <span className="text-white/20">|</span>
            <span>
              Last login: <strong className="text-white/80">Today at {lastLoginFormatted}</strong>
            </span>
          </div>
        </div>

        {/* ── Main carousel body: left text + right widget ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 px-8 sm:px-16 lg:px-24 py-12 lg:py-16 items-center">

          {/* Left: vertical slide number rail */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center h-full py-6 gap-6">
            {slides.map((s, idx) => {
              const isActive = currentSlide === idx;
              return (
                <div
                  key={s.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => goTo(idx)}
                >
                  <button
                    className={`text-xs font-black transition-all duration-300 ${
                      isActive
                        ? 'text-indigo-400 scale-125'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    0{s.id}
                  </button>

                  {/* Vertical progress track */}
                  {idx < slides.length && (
                    <div className="relative w-0.5 h-16 bg-white/10 my-2 rounded-full overflow-hidden">
                      {isActive && (
                        <div
                          className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full transition-all duration-100 ease-linear"
                          style={{ height: `${progress}%` }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Centre: Blur-text-reveal headline & CTAs */}
          <div className="lg:col-span-6 space-y-7">
            {/* Slide badge pill */}
            <div
              key={`badge-${currentSlide}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-bold w-fit shadow-sm animate-fade-in"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{slide.badge}</span>
            </div>

            {/* Title with blur reveal — re-key forces re-animation on slide change */}
            <h1 key={`title-${currentSlide}`} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1]">
              <BlurTextReveal
                text={slide.title}
                className="text-white drop-shadow-lg"
                delay={0.05}
                duration={0.9}
              />
            </h1>

            {/* Subtitle with blur reveal */}
            <p key={`sub-${currentSlide}`} className="text-base sm:text-lg text-white/65 max-w-xl leading-relaxed">
              <BlurTextReveal
                text={slide.subtitle}
                delay={0.35}
                duration={0.7}
              />
            </p>

            {/* User status pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/6 border border-white/10 backdrop-blur-md">
                <span>Member since</span>
                <strong className="text-white">{memberSince}</strong>
              </div>
              {stats?.overdue > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                  <span>⚠️ {stats.overdue} past deadline</span>
                </div>
              )}
              {stats?.total > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{stats.completionRate || 0}% complete</span>
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(slide.ctaRoute)}
                className="px-8 py-4 rounded-2xl bg-white text-indigo-950 font-black text-sm shadow-2xl hover:bg-indigo-50 active:scale-95 transition-all flex items-center gap-2.5 group hover:shadow-indigo-500/20"
              >
                <Kanban className="w-5 h-5 text-indigo-600" />
                <span>{slide.ctaPrimary}</span>
                <ArrowRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenCreateModal}
                className="px-8 py-4 rounded-2xl bg-indigo-600/80 hover:bg-indigo-600 backdrop-blur-md text-white font-black text-sm shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2.5 border border-indigo-500/40"
              >
                <Plus className="w-5 h-5" />
                <span>{slide.ctaSecondary}</span>
              </button>
            </div>
          </div>

          {/* Right: live interactive widget */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white/6 backdrop-blur-2xl border border-white/12 shadow-2xl relative overflow-hidden">
              {/* Corner glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* ── Slide 1: Kanban preview ── */}
              {slide.previewType === 'kanban' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-bold text-white/70">
                    <span className="flex items-center gap-2">
                      <Kanban className="w-4 h-4 text-indigo-400" /> Live Board Stream
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      3 Columns
                    </span>
                  </div>
                  {[
                    { priority: 'High Priority', color: 'text-rose-400 bg-rose-500/15 border-rose-500/30', title: 'Full-Stack Security Audit', status: 'To Do', statusColor: 'bg-white/10 text-white/70' },
                    { priority: 'Medium', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30', title: 'React Bits Hero Carousel', status: 'In Progress', statusColor: 'bg-sky-500/20 text-sky-300' },
                    { priority: 'Achieved', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30', title: 'JWT Token Middleware', status: 'Done', statusColor: 'bg-emerald-500/20 text-emerald-300' },
                  ].map((card) => (
                    <div key={card.title} className="p-3.5 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between gap-3">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${card.color}`}>{card.priority}</span>
                        <p className={`text-xs font-bold mt-1.5 text-white/90 ${card.status === 'Done' ? 'line-through opacity-50' : ''}`}>{card.title}</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${card.statusColor} whitespace-nowrap`}>{card.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Slide 2: Performance metrics ── */}
              {slide.previewType === 'stats' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-bold text-white/70">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-sky-400" /> Real-Time Productivity
                    </span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                      {stats?.completionRate || 0}% Complete
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Total Tracked', val: stats?.total || 0, color: 'text-white' },
                      { label: 'Completed', val: stats?.completed || 0, color: 'text-emerald-400' },
                      { label: 'In Progress', val: stats?.inprogress || 0, color: 'text-sky-400' },
                      { label: 'To Do', val: stats?.todo || 0, color: 'text-white/60' },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="p-3.5 rounded-2xl bg-white/5 border border-white/8 text-center">
                        <span className="text-[10px] text-white/50 font-medium block">{label}</span>
                        <p className={`text-2xl font-black mt-1 ${color}`}>{val}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/8 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-white/60">
                      <span>Overall Progress</span>
                      <span className="text-indigo-400">{stats?.completionRate || 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${stats?.completionRate || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Slide 3: Search & filter preview ── */}
              {slide.previewType === 'filter' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-bold text-white/70">
                    <span className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-emerald-400" /> Instant Category Engine
                    </span>
                    <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full border border-white/10">
                      Active Filters
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['All Priorities', 'High Priority', 'Medium'].map((label, i) => (
                      <span
                        key={label}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border ${
                          i === 0
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : i === 1
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/8 text-xs text-white/50 flex items-center justify-between">
                    <span>Search: <strong className="text-indigo-400">"API"</strong></span>
                    <span className="text-[10px] bg-white/8 px-2 py-0.5 rounded font-bold text-white/60">2 Matches</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/8 text-[11px] text-white/50 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Sort by Due Date, Priority, or Creation Date instantly.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom controls bar ── */}
        <div className="px-8 sm:px-16 lg:px-24 py-5 flex items-center justify-between bg-slate-950/40 backdrop-blur-sm">
          {/* Dots + counter */}
          <div className="flex items-center gap-3">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => goTo(idx)}
                aria-label={`Slide ${s.id}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-8 bg-indigo-400'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
            <span className="ml-2 text-xs text-white/40 font-bold">
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous"
              className="p-2 rounded-xl bg-white/6 border border-white/10 text-white/60 hover:bg-white/12 hover:text-white transition-colors active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="p-2 rounded-xl bg-white/6 border border-white/10 text-white/60 hover:bg-white/12 hover:text-white transition-colors active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero9;
