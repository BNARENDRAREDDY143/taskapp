import React from 'react';
import { Calendar, Tag, Edit2, Trash2, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const priorityStyles = {
  high: {
    label: 'High',
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    dot: 'bg-rose-500 shadow-glow-rose',
    accentLine: 'from-rose-500/80 to-red-400',
    hoverBorder: 'hover:border-rose-400/60 dark:hover:border-rose-500/50'
  },
  medium: {
    label: 'Medium',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    dot: 'bg-amber-500 shadow-glow-amber',
    accentLine: 'from-amber-500/80 to-yellow-400',
    hoverBorder: 'hover:border-amber-400/60 dark:hover:border-amber-500/50'
  },
  low: {
    label: 'Low',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-500 shadow-glow-emerald',
    accentLine: 'from-emerald-500/80 to-teal-400',
    hoverBorder: 'hover:border-emerald-400/60 dark:hover:border-emerald-500/50'
  }
};

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onView,
  onStatusChange
}) => {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'inprogress';
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    !isCompleted;

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })
    : null;

  const pConfig = priorityStyles[task.priority] || priorityStyles.medium;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const nextStatus =
    task.status === 'todo'
      ? 'inprogress'
      : task.status === 'inprogress'
      ? 'completed'
      : 'todo';

  const nextStatusLabel =
    task.status === 'todo'
      ? 'Start'
      : task.status === 'inprogress'
      ? 'Complete'
      : 'Reopen';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`task-card-animated group relative p-4 rounded-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border shadow-soft hover:shadow-card-hover cursor-grab active:cursor-grabbing select-none transition-all duration-300 ${
        pConfig.hoverBorder
      } ${
        isCompleted
          ? 'border-emerald-500/20 dark:border-emerald-500/20 bg-slate-50/50 dark:bg-slate-900/50 opacity-85 hover:opacity-100'
          : isOverdue
          ? 'border-rose-400/50 dark:border-rose-500/40 bg-gradient-to-br from-rose-50/20 to-transparent'
          : 'border-slate-200/80 dark:border-slate-800'
      }`}
    >
      {/* Top micro status progress indicator bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${
          isCompleted
            ? 'from-emerald-500 to-teal-400'
            : isInProgress
            ? 'from-indigo-500 via-purple-500 to-sky-400 animate-pulse'
            : 'from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800'
        }`}
      />

      {/* Header Badges: Project tag & Priority badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pt-0.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 truncate max-w-[130px] shadow-sm">
          <Tag className="w-3 h-3 text-slate-400 flex-shrink-0" />
          <span className="truncate">{task.projectName || 'General'}</span>
        </span>

        {/* Priority Badge with glowing dot */}
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm ${pConfig.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${pConfig.dot} animate-pulse`} />
          <span>{pConfig.label}</span>
        </span>
      </div>

      {/* Task Title */}
      <h3
        onClick={() => onView(task)}
        className={`text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors ${
          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
        }`}
      >
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer Details: Date and Action buttons */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Due Date Indicator */}
        <div className="flex items-center gap-1.5 text-xs">
          {formattedDate ? (
            <span
              className={`inline-flex items-center gap-1 font-medium transition-colors ${
                isOverdue
                  ? 'text-rose-600 dark:text-rose-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title={isOverdue ? 'Overdue!' : 'Due Date'}
            >
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{formattedDate}</span>
              {isOverdue && (
                <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.2 rounded shadow-sm">
                  Late
                </span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-600 text-[11px]">No deadline</span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Quick cycle status button */}
          <button
            onClick={() => onStatusChange(task._id, nextStatus)}
            title={`Move to ${nextStatusLabel}`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white active:scale-95 transition-all shadow-sm"
          >
            <span>{nextStatusLabel}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-800 active:scale-90 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task._id)}
            title="Delete Task"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-90 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
