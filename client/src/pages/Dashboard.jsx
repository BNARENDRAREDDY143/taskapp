import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import FilterBar from '../components/FilterBar';
import KanbanBoard from '../components/KanbanBoard';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import Toast from '../components/Toast';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  ArrowRight,
  Plus,
  HelpCircle,
  Keyboard,
  Mail,
  ChevronDown,
  Tag,
  TrendingUp
} from 'lucide-react';

const faqs = [
  {
    q: 'How does the Kanban board work?',
    a: 'You can drag task cards between To Do, In Progress, and Completed columns, or use the 1-click status shifter button on each card for rapid status changes.'
  },
  {
    q: 'Can I filter tasks by priority and category?',
    a: 'Yes! On the Tasks page, you can search across titles and descriptions, filter by High/Medium/Low priority, and organize by custom project categories.'
  },
  {
    q: 'Are my sessions and tasks persistent?',
    a: 'Yes, your session is authenticated via secure JWT tokens and saved in MongoDB so your board is always up to date across sessions.'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

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
  const [activeFaq, setActiveFaq] = useState(null);
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

  // Fetch recent activity tasks (for the activity section)
  const fetchRecentActivity = useCallback(async () => {
    try {
      const res = await axiosClient.get('/tasks?sortBy=createdAt-desc');
      if (res.data.success) {
        const all = res.data.data;
        setRecentTasks(all.slice(0, 4));
        setCompletedTasks(all.filter((t) => t.status === 'completed').slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch recent activity:', err);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchStats(); fetchRecentActivity(); }, [fetchStats, fetchRecentActivity]);

  // Status Change with Optimistic UI
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
      await axiosClient.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchStats();
      fetchRecentActivity();
      const label = newStatus === 'todo' ? 'To Do' : newStatus === 'inprogress' ? 'In Progress' : 'Completed';
      showToast(`Task shifted to ${label}`);
    } catch (err) {
      setTasks(previousTasks);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // Create or Update task
  const handleSaveTask = async (taskData, taskId) => {
    try {
      if (taskId) {
        const res = await axiosClient.put(`/tasks/${taskId}`, taskData);
        if (res.data.success) {
          showToast('Task details updated');
          fetchTasks(); fetchStats(); fetchRecentActivity();
          return { success: true };
        }
      } else {
        const res = await axiosClient.post('/tasks', taskData);
        if (res.data.success) {
          showToast('Task created successfully');
          fetchTasks(); fetchStats(); fetchRecentActivity();
          return { success: true };
        }
      }
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to save task' };
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axiosClient.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      fetchStats(); fetchRecentActivity();
      showToast('Task removed from board');
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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] flex flex-col transition-colors relative overflow-hidden bg-grid-pattern text-slate-900 dark:text-slate-100">
      {/* Floating Ambient Glow Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-float-delayed" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-500/10 dark:bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <Navbar onOpenCreateModal={() => handleOpenCreateModal('todo')} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">

        {/* ── 1. Performance & Task Overview Stats ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Performance &amp; Task Overview</span>
            </h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage on Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Total */}
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Tasks</span>
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                {loading ? '...' : stats?.total || 0}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Completion</span>
                  <span className="text-indigo-600 font-bold">{stats?.completionRate || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats?.completionRate || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* To Do */}
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>To Do</span>
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <ListTodo className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                {loading ? '...' : stats?.todo || 0}
              </div>
              <p className="mt-3 text-xs text-slate-500">Backlog items ready to start</p>
            </div>

            {/* In Progress */}
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>In Progress</span>
                <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600">
                  <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                {loading ? '...' : stats?.inprogress || 0}
              </div>
              <p className="mt-3 text-xs text-sky-600 font-semibold">Active tasks in development</p>
            </div>

            {/* Completed */}
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Completed</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                {loading ? '...' : stats?.completed || 0}
              </div>
              <p className="mt-3 text-xs text-emerald-600 font-semibold">Achieved milestones</p>
            </div>
          </div>
        </section>

        {/* ── 2. About TaskPro + Tutorial + Shortcuts + FAQ ── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About TaskPro */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Platform Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                About TaskPro
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                TaskPro is an intuitive task and project management suite engineered on the MERN stack (MongoDB, Express, React, and Node.js). Designed to help individuals and distributed teams organize, prioritize, and conquer deadlines with zero cognitive overhead.
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Member since <span className="font-semibold text-indigo-600 dark:text-indigo-400">{memberSince}</span>
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Core Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                {[
                  'Fluid Kanban drag-and-drop workflow',
                  'Real-time status & priority analytics',
                  'Due date tracking & overdue notifications',
                  'Instant multi-faceted search & filter engine'
                ].map((cap) => (
                  <div key={cap} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use Tutorial */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
                How to Use the App (3 Quick Steps)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                {[
                  { n: 1, title: 'Create Task', desc: 'Set title, priority, due date, and category.' },
                  { n: 2, title: 'Drag & Organize', desc: 'Move cards across To Do, In Progress, & Done.' },
                  { n: 3, title: 'Track & Achieve', desc: 'Monitor completion rate and resolve milestones.' }
                ].map(({ n, title, desc }) => (
                  <div key={n} className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
                    <span className="w-6 h-6 mx-auto rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">{n}</span>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Shortcuts + FAQ + Support */}
          <div className="space-y-6">
            {/* Keyboard Shortcuts */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <Keyboard className="w-4 h-4 text-indigo-600" />
                <span>Productivity Shortcuts</span>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Open Create Task Modal', key: 'N' },
                  { label: 'Go to Task Board', key: 'B' },
                  { label: 'Toggle Theme Mode', key: 'T' }
                ].map(({ label, key }) => (
                  <div key={key} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400">{label}</span>
                    <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono font-bold text-[11px]">{key}</kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Frequently Asked Questions</span>
              </div>
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full p-3 text-left text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center justify-between transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === idx && (
                      <div className="px-3 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Support Card */}
            <div className="p-5 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-xs text-indigo-900 dark:text-indigo-200 flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <div>
                <span className="font-bold block">Need Technical Support?</span>
                <span className="text-[11px] text-indigo-700 dark:text-indigo-300">Contact developer team at support@taskpro.local</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Recent Activity ── */}
        <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Recent Activity &amp; Highlights</span>
            </h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recently Created */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recently Created Tasks</span>
              </h3>
              <div className="space-y-2.5">
                {recentTasks.length > 0 ? recentTasks.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => setViewingTask(t)}
                    className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-2 border border-slate-200/50 dark:border-slate-700/40"
                  >
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <Tag className="w-3 h-3" />
                        <span>{t.projectName || 'General'}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {t.status}
                    </span>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No tasks yet. Create your first task!</p>
                )}
              </div>
            </div>

            {/* Recently Completed */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recently Completed Achievements</span>
              </h3>
              <div className="space-y-2.5">
                {completedTasks.length > 0 ? (
                  completedTasks.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => setViewingTask(t)}
                      className="p-3 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer flex items-center justify-between gap-2 border border-emerald-200/50 dark:border-emerald-800/40"
                    >
                      <div className="truncate">
                        <div className="text-xs font-semibold line-through decoration-slate-300 dark:decoration-slate-600 text-slate-500 dark:text-slate-400 truncate">
                          {t.title}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                        Done
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4 text-center">
                    No completed tasks yet. Finish a task on the board to see it here!
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Animated Analytics & Key Metrics (DashboardStats component) ── */}
        <section className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Detailed Analytics</span>
          </h2>
          <DashboardStats stats={stats} loading={loading} />
        </section>

        {/* ── 5. Filter, Search & View Controls ── */}
        <FilterBar
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          projects={stats?.projects || []}
          onOpenCreateModal={() => handleOpenCreateModal('todo')}
          totalMatching={tasks.length}
        />

        {/* ── 6. Dynamic View: Kanban Board vs. List ── */}
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

      {/* Detail Modal */}
      <TaskDetailModal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        task={viewingTask}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

export default Dashboard;
