import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus, ListTodo, Clock, CheckCircle2, Sparkles, Layers } from 'lucide-react';

const columns = [
  {
    id: 'todo',
    title: 'To Do',
    icon: ListTodo,
    dotColor: 'bg-slate-400',
    countBadge: 'bg-slate-200/80 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    accentBorder: 'from-slate-400 to-slate-500',
    glowColor: 'group-hover:shadow-soft'
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    icon: Clock,
    dotColor: 'bg-sky-500',
    countBadge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200 border border-sky-200/50 dark:border-sky-800/50',
    accentBorder: 'from-sky-400 to-indigo-500',
    glowColor: 'shadow-glow'
  },
  {
    id: 'completed',
    title: 'Completed',
    icon: CheckCircle2,
    dotColor: 'bg-emerald-500',
    countBadge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-200/50 dark:border-emerald-800/50',
    accentBorder: 'from-emerald-400 to-teal-500',
    glowColor: 'shadow-glow-emerald'
  }
];

const KanbanBoard = ({
  tasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onViewTask,
  onOpenCreateModal
}) => {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(taskId, columnId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        const isOver = dragOverColumn === column.id;
        const Icon = column.icon;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`group relative flex flex-col rounded-3xl bg-slate-100/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-4 transition-all duration-300 min-h-[540px] ${
              isOver ? 'kanban-col-drag-over' : 'hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* Radiant Top Glow Line */}
            <div
              className={`absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r ${column.accentBorder} opacity-80 group-hover:opacity-100 transition-opacity`}
            />

            {/* Column Header */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200/70 dark:border-slate-800/80 pt-1">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor} shadow-sm`} />
                <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                  <span>{column.title}</span>
                </h2>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${column.countBadge}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              {/* Quick Add Button */}
              <button
                onClick={() => onOpenCreateModal(column.id)}
                title={`Add task to ${column.title}`}
                className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards Container */}
            <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[calc(100vh-320px)] pr-1 pb-2">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onView={onViewTask}
                  onStatusChange={onStatusChange}
                />
              ))}

              {/* Empty Column State */}
              {columnTasks.length === 0 && (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 text-center bg-white/30 dark:bg-slate-900/20 group-hover:border-indigo-300/50 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-2">
                    <Layers className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                    No tasks in {column.title}
                  </p>
                  <button
                    onClick={() => onOpenCreateModal(column.id)}
                    className="mt-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create task</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
