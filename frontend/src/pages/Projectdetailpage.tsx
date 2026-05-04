import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useAddMembers } from '../hooks/useProjects';
import { Button, Modal, Input, Select, Spinner, EmptyState, Pagination, StatusBadge } from '../components';
import type { TaskDto, TaskStatus } from '../types';
import { MultiUserSelector } from '../components/MultiUserSelector';
import type { UserMinimal } from '../api/userApi';
import { SingleUserSelector } from '../components/SingleUserSelector';

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'];
const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do', IN_PROGRESS: 'In Progress', ON_HOLD: 'On Hold', COMPLETED: 'Completed',
};

export const ProjectDetailPage: React.FC = () => {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState<TaskDto | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserMinimal[]>([]);

  // Task form state
  const [form, setForm] = useState({ title: '', description: '', assignedToUserId: '', dueDate: '', status: 'TODO' as TaskStatus});

  const { data, isLoading } = useProjectTasks(projectId, { status: statusFilter || undefined, page });
  const createTask = useCreateTask(projectId);
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const addMembers = useAddMembers(projectId);

  const tasks = data?.content ?? [];

  const resetForm = () => setForm({ title: '', description: '', assignedToUserId: '', dueDate: '', status: 'TODO' as TaskStatus});

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTask.mutateAsync({
      title: form.title,
      description: form.description || undefined,
      assignedToUserId: form.assignedToUserId || undefined,
      dueDate: form.dueDate ? `${form.dueDate}T00:00:00` : undefined,
    });
    setShowCreate(false);
    resetForm();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTask) return;
    await updateTask.mutateAsync({
      taskId: editTask.id,
      title: form.title,
      description: form.description || undefined,
      assignedToUserId: form.assignedToUserId || undefined,
      dueDate: form.dueDate ? `${form.dueDate}T00:00:00` : undefined,
      status: form.status,
    });
    setEditTask(null);
    resetForm();
  };

  const openEdit = (task: TaskDto) => {
    setEditTask(task);
    setForm({
      title: task.title,
      description: task.description ?? '',
      assignedToUserId: task.assignedToId ?? '',
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: task.status,
    });
  };

  const handleAddMembers = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding members:', selectedUsers, projectId);
    const ids = selectedUsers.map((u) => u.id);
    await addMembers.mutateAsync({ memberIds: ids });
    setShowAddMember(false);
    setSelectedUsers([]);
  };

  const quickStatus = (task: TaskDto, status: TaskStatus) => {
    updateTask.mutate({ taskId: task.id, status });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="text-slate-500 hover:text-slate-300 transition text-sm">← Projects</button>
          <span className="text-slate-700">/</span>
          <h1 className="text-xl font-bold text-slate-100">Tasks</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAddMember(true)}>+ Members</Button>
          <Button size="sm" onClick={() => { setShowCreate(true); resetForm(); }}>+ Task</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
              ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:text-slate-200'}`}
          >
            {s === '' ? 'All' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : tasks.length === 0 ? (
        <EmptyState icon="◎" title="No tasks found" subtitle="Create the first task for this project" />
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 bg-slate-900/60 border rounded-xl flex items-start gap-4 group transition
                ${task.overdue ? 'border-red-500/20' : 'border-white/5 hover:border-white/10'}`}
            >
              {/* Status dot / quick change */}
              <div className="relative mt-0.5">
                <select
                  value={task.status}
                  onChange={(e) => quickStatus(task, e.target.value as TaskStatus)}
                  className="appearance-none bg-transparent cursor-pointer text-lg focus:outline-none"
                  title="Change status"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s === 'COMPLETED' ? '✓' : s === 'IN_PROGRESS' ? '↻' : s === 'ON_HOLD' ? '⏸' : '○'}</option>)}
                </select>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </p>
                  <StatusBadge status={task.status} />
                  {task.overdue && <span className="text-xs text-red-400 font-medium">Overdue</span>}
                </div>
                {task.description && <p className="text-xs text-slate-500 mt-1 truncate">{task.description}</p>}
                <div className="flex items-center gap-3 mt-1.5">
                  {task.assignedToEmail && (
                    <span className="text-xs text-slate-500">👤 {task.assignedToEmail}</span>
                  )}
                  {task.dueDate && (
                    <span className={`text-xs ${task.overdue ? 'text-red-400' : 'text-slate-500'}`}>
                      📅 {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <Button variant="ghost" size="sm" onClick={() => openEdit(task)}>Edit</Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteTask.mutate(task.id)}
                  loading={deleteTask.isPending}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />

      {/* Create Task Modal */}
      {showCreate && (
        <Modal title="New Task" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <SingleUserSelector
                label="Assign to"
                value={form.assignedToUserId}
                onSelect={(user) => {
                    setForm({ ...form, assignedToUserId: user?.id || "" });
                }}
            />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <div className="flex gap-2 justify-end mt-1">
              <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" loading={createTask.isPending}>Create</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Task Modal */}
      {editTask && (
        <Modal title="Edit Task" onClose={() => setEditTask(null)}>
          <form onSubmit={handleEdit} className="flex flex-col gap-3">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <SingleUserSelector
                label="Assign to"
                value={form.assignedToUserId}
                onSelect={(user) => {
                    setForm({ ...form, assignedToUserId: user?.id || "" });
                }}
            />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </Select>
            <div className="flex gap-2 justify-end mt-1">
              <Button variant="ghost" type="button" onClick={() => setEditTask(null)}>Cancel</Button>
              <Button type="submit" loading={updateTask.isPending}>Save</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Members Modal */}
      {showAddMember && (
        <Modal title="Add Members" onClose={() => setShowAddMember(false)}>
          <form onSubmit={handleAddMembers} className="flex flex-col gap-3">
            <MultiUserSelector
                label="Project Members"
                selectedUsers={selectedUsers}
                onChange={setSelectedUsers}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" type="button" onClick={() => setShowAddMember(false)}>Cancel</Button>
              <Button type="submit" loading={addMembers.isPending}>Add</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};