import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects, useCreateProject, useDeleteProject } from '../hooks/useProjects';
import { Button, Modal, Input, Spinner, EmptyState, Pagination } from '../components';
import { MultiUserSelector } from '../components/MultiUserSelector';
import type { UserMinimal } from '../api/userApi';

export const ProjectsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<UserMinimal[]>([]);
  const navigate = useNavigate();

  const { data, isLoading } = useProjects(page);
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const projects = data?.content ?? [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createProject.mutateAsync({ name: name.trim(), memberIds: selectedUsers.map((u) => u.id) });
    setShowCreate(false);
    setName('');
    setSelectedUsers([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">{data?.totalElements ?? 0} total</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ New Project</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : projects.length === 0 ? (
        <EmptyState icon="◈" title="No projects yet" subtitle="Create your first project to get started" />
      ) : (
        <div className="grid gap-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 bg-slate-900/60 border border-white/5 rounded-xl hover:border-white/10 transition cursor-pointer group"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-sm shrink-0">
                  {p.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition">{p.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{p.taskCount} tasks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-md font-medium border
                  ${p.role === 'ADMIN'
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                  {p.role}
                </span>
                {p.role === 'ADMIN' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); deleteProject.mutate(p.id); }}
                    loading={deleteProject.isPending}
                  >
                    Delete
                  </Button>
                )}
                <span className="text-slate-600 group-hover:text-slate-400 transition text-sm">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onChange={setPage} />

      {showCreate && (
        <Modal title="New Project" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input
              label="Project Name"
              placeholder="e.g. Website Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <MultiUserSelector
                label="Project Members"
                selectedUsers={selectedUsers}
                onChange={setSelectedUsers}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" loading={createProject.isPending}>Create</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};