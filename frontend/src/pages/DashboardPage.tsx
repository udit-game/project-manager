import React, { useState } from 'react';
import { useMyTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { StatusBadge, Spinner, EmptyState } from '../components/index';
import type { TaskStatus } from '../types';

const STATUS_OPTIONS: { label: string; value: TaskStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'To Do', value: 'TODO' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'On Hold', value: 'ON_HOLD' },
  { label: 'Completed', value: 'COMPLETED' },
];

export const DashboardPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const { data: tasksData, isLoading: loadingTasks } = useMyTasks({ status: statusFilter || undefined });
  const { data: projectsData, isLoading: loadingProjects } = useProjects(0);

  const tasks = tasksData?.content ?? [];
  const projects = projectsData?.content ?? [];

  // Stat cards
  const total = tasksData?.totalElements ?? 0;
  const overdue = tasks.filter((t) => t.overdue).length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;

  const stats = [
    { label: 'Total Tasks', value: total, icon: '◎', color: 'text-indigo-400' },
    { label: 'In Progress', value: inProgress, icon: '↻', color: 'text-blue-400' },
    { label: 'Overdue', value: overdue, icon: '⚠', color: 'text-red-400' },
    { label: 'Completed', value: completed, icon: '✓', color: 'text-emerald-400' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Your tasks and progress at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
            <div className={`text-xl mb-1 ${color}`}>{icon}</div>
            <div className="text-2xl font-bold text-slate-100">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* My Tasks */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-white/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200">My Tasks</h2>
            <div className="flex gap-1">
              {STATUS_OPTIONS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`px-2 py-1 rounded text-xs transition
                    ${statusFilter === value ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loadingTasks ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : tasks.length === 0 ? (
            <EmptyState icon="✓" title="No tasks found" subtitle="You're all caught up!" />
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start justify-between p-3 rounded-lg border transition
                    ${task.overdue ? 'border-red-500/20 bg-red-500/5' : 'border-white/5 bg-white/2 hover:bg-white/5'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 font-medium truncate">{task.title}</p>
                    {task.dueDate && (
                      <p className={`text-xs mt-0.5 ${task.overdue ? 'text-red-400' : 'text-slate-500'}`}>
                        {task.overdue ? '⚠ ' : ''}Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects sidebar */}
        <div className="bg-slate-900/60 border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-4">My Projects</h2>
          {loadingProjects ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : projects.length === 0 ? (
            <EmptyState icon="◈" title="No projects" subtitle="Join or create one" />
          ) : (
            <div className="flex flex-col gap-2">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:bg-white/5 transition">
                  <div>
                    <p className="text-sm text-slate-200 font-medium">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.taskCount} tasks · {p.role}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium
                    ${p.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {p.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};