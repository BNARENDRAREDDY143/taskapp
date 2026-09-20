import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import KanbanBoard from '../components/KanbanBoard';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import Toast from '../components/Toast';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
  LayoutGrid,
  List
} from 'lucide-react';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Filters and View State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [viewMode, setViewMode] = useState('kanban');

  // Modals & Notifications
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState('todo');
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await axiosClient.get('/tasks/stats');
      if (res.data.success) setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch task stats:', err);
    }
  }, []);

  // Fetch Tasks with current filters
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (projectFilter !== 'all') params.projectName = projectFilter;
      if (sortBy) params.sortBy = sortBy;
      const res = await axiosClient.get('/tasks', { params });
      if (res.data.success) setTasks(res.data.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, projectFilter, sortBy]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Drag-and-drop / Status change with optimistic UI
  const handleStatusChange = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId
          ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : null }
          : t
      )
    );
    try {
      await axiosClient.put(`/tasks/${taskId}/status`, { status: newStatus });
      fetchStats();
      const statusLabel = newStatus === 'todo' ? 'To Do' : newStatus === 'inprogress' ? 'In Progress' : 'Completed';
      showToast(`Task moved to ${statusLabel}`);
    } catch (err) {
      setTasks(previousTasks);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // Create / Update task
  const handleSaveTask = async (taskData, taskId) => {
    try {
      if (taskId) {
        const res = await axiosClient.put(`/tasks/${taskId}`, taskData);
        if (res.data.success) {
          showToast('Task updated successfully');
          fetchTasks(); fetchStats();
          return { success: true };
        }
      } else {
        const res = await axiosClient.post('/tasks', taskData);
        if (res.data.success) {
          showToast('Task created successfully');
          fetchTasks(); fetchStats();
          return { success: true };
        }
      }
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to save task' };
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to remove this task?')) return;
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      fetchStats();
      showToast('Task deleted');
      if (viewingTask && viewingTask._id === taskId) setViewingTask(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  const handleOpenCreateModal = (status = 'todo') => {
    setEditingTask(null);
    setModalInitialStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950 text-white">

      {/* ══════════════════════════════════════════
          HERO 9 — FULL-SCREEN VIDEO BACKGROUND
      ══════════════════════════════════════════ */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Ambient animated gradient mesh (fallback + always visible base) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 15% 40%, rgba(79,70,229,0.35) 0%, transparent 55%), ' +
              'radial-gradient(ellipse at 80% 15%, rgba(124,58,237,0.30) 0%, transparent 55%), ' +
              'radial-gradient(ellipse at 60% 85%, rgba(14,165,233,0.20) 0%, transparent 55%), ' +
              '#030712',
          }}
        />

        {/* Autoplay looping neon video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-[2500ms] ${
            videoLoaded ? 'opacity-45' : 'opacity-0'
          }`}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-purple-and-blue-neon-lights-42999-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-glowing-purple-particles-on-dark-background-42990-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* Cinematic overlay layers */}
        {/* Left-side text-readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-slate-950/20" />
        {/* Top + bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/85" />
        {/* Global dark tint for contrast */}
        <div className="absolute inset-0 bg-slate-950/30" />

        {/* Floating animated ambient orbs */}
        <div className="absolute top-1/4 -left-24 w-[480px] h-[480px] bg-indigo-600/20 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[80px] animate-float-delayed pointer-events-none" />
        <div className="absolute top-2/3 left-1/3 w-[300px] h-[300px] bg-sky-600/15 rounded-full blur-[90px] animate-float-slow pointer-events-none" />
      </div>

      {/* ══════════════════════════════════════════
          NAVBAR — above the video
      ══════════════════════════════════════════ */}
      <div className="relative z-20">
        <Navbar onOpenCreateModal={() => handleOpenCreateModal('todo')} />
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT — glassmorphic panels on video
      ══════════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-5 relative z-10">

        {/* ── Status Category Tabs Bar ── */}
        <section className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/6 backdrop-blur-2xl border border-white/10 shadow-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">

            {/* All Tasks */}
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Tasks</span>
              <span className="ml-1 px-1.5 rounded-full text-[10px] bg-white/15">
                {stats?.total || 0}
              </span>
            </button>

            {/* To Do */}
            <button
              onClick={() => setStatusFilter('todo')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                statusFilter === 'todo'
                  ? 'bg-slate-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>To Do</span>
              <span className="ml-1 px-1.5 rounded-full text-[10px] bg-white/15">
                {stats?.todo || 0}
              </span>
            </button>

            {/* In Progress */}
            <button
              onClick={() => setStatusFilter('inprogress')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                statusFilter === 'inprogress'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>In Progress</span>
              <span className="ml-1 px-1.5 rounded-full text-[10px] bg-white/15">
                {stats?.inprogress || 0}
              </span>
            </button>

            {/* Completed */}
            <button
              onClick={() => setStatusFilter('completed')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
              <span className="ml-1 px-1.5 rounded-full text-[10px] bg-white/15">
                {stats?.completed || 0}
              </span>
            </button>
          </div>

          {/* Overdue badge */}
          {stats?.overdue > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{stats.overdue} Overdue</span>
            </div>
          )}
        </section>

        {/* ── View Toggle + Create Task ── */}
        <div className="flex items-center justify-between gap-3">
          {/* Board / List toggle */}
          <div className="flex items-center bg-white/8 backdrop-blur-md border border-white/12 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* + Create Task */}
          <button
            onClick={() => handleOpenCreateModal('todo')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 active:scale-95 transition-all border border-indigo-500/40"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* ── Kanban Board / List View ── */}
        {viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
            onViewTask={(task) => setViewingTask(task)}
            onOpenCreateModal={handleOpenCreateModal}
          />
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onEditTask={handleOpenEditModal}
            onDeleteTask={handleDeleteTask}
            onViewTask={(task) => setViewingTask(task)}
          />
        )}
      </main>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
        initialStatus={modalInitialStatus}
        projects={stats?.projects || []}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* Toast Feedback */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default TasksPage;
