import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import Hero9 from '../components/Hero9';
import TaskModal from '../components/TaskModal';
import Toast from '../components/Toast';

const HomePage = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axiosClient.get('/tasks/stats');
        if (res.data.success) setStats(res.data.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    loadStats();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const res = await axiosClient.post('/tasks', taskData);
      if (res.data.success) {
        showToast('New task added successfully!');
        const statsRes = await axiosClient.get('/tasks/stats');
        if (statsRes.data.success) setStats(statsRes.data.data);
        return { success: true };
      }
    } catch (err) {
      return { error: err.response?.data?.message || 'Failed to create task' };
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const lastLoginFormatted = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-white">
      {/* Shared Navbar */}
      <Navbar onOpenCreateModal={() => setIsModalOpen(true)} />

      {/* Full-screen Hero 9 — video background + blur text reveal + carousel */}
      <div className="flex-1 relative z-10 w-full">
        <Hero9
          user={user}
          stats={stats}
          memberSince={memberSince}
          lastLoginFormatted={lastLoginFormatted}
          onOpenCreateModal={() => setIsModalOpen(true)}
        />
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
        projects={stats?.projects || []}
      />

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
