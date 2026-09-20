import React from 'react';
import { X, Calendar, Tag, Clock, CheckCircle2, Edit2, Trash2, ArrowRight } from 'lucide-react';

const priorityConfig = {
  high: {
    label: 'High Priority',
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
  },
  medium: {
    label: 'Medium Priority',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
  },
  low: {
    label: 'Low Priority',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
  }
};

const statusConfig = {
  todo: {
    label: 'To Do',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
  },
  inprogress: {
    label: 'In Progress',
    badge: 'bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800'
  },
  completed: {
    label: 'Completed',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  }
};

const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'completed';
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    !isCompleted;

  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status = statusConfig[task.status] || statusConfig.todo;

  const formatDate = (dateString) => {
    if (!dateString) return 'None';
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${status.badge}`}
            >
              {status.label}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${priority.badge}`}
            >
              {priority.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Project: {task.projectName || 'General'}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {task.description || (
              <span className="italic text-slate-400">No additional description provided.</span>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </div>
              <div
                className={`font-semibold ${
                  isOverdue
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                {formatDate(task.dueDate)}
                {isOverdue && <span className="ml-1 text-[10px] text-rose-600 font-bold uppercase">(Overdue)</span>}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Created At</span>
              </div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(task.createdAt)}
              </div>
            </div>

            {task.completedAt && (
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 col-span-2">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed On</span>
                </div>
                <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                  {formatDate(task.completedAt)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(task._id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
