import React from 'react';
import { Calendar, Tag, Check, MoreVertical, Edit2, Trash2, Eye, AlertCircle } from 'lucide-react';

const priorityConfig = {
  high: {
    label: 'High',
    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
  },
  medium: {
    label: 'Medium',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
  },
  low: {
    label: 'Low',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
  }
};

const TaskList = ({
  tasks,
  onStatusChange,
  onEditTask,
  onDeleteTask,
  onViewTask
}) => {
  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
        <div className="w-12 h-12 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No tasks match your criteria
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Try resetting your filters or create a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">Done</th>
              <th className="py-3.5 px-4">Task Details</th>
              <th className="py-3.5 px-4">Project</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {tasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                !isCompleted;

              const priority = priorityConfig[task.priority] || priorityConfig.medium;

              return (
                <tr
                  key={task._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Done Toggle Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() =>
                        onStatusChange(
                          task._id,
                          isCompleted ? 'todo' : 'completed'
                        )
                      }
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mx-auto ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                      }`}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                    <div
                      onClick={() => onViewTask(task)}
                      className={`font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors ${
                        isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </td>

                  {/* Project Tag */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{task.projectName || 'General'}</span>
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${priority.badge}`}
                    >
                      {priority.label}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {task.dueDate ? (
                      <div
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          isOverdue
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          {new Date(task.dueDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] uppercase font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 px-1 py-0.2 rounded">
                            Overdue
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                        task.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : task.status === 'inprogress'
                          ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewTask(task)}
                        title="View Details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditTask(task)}
                        title="Edit Task"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task._id)}
                        title="Delete Task"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
