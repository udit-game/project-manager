import React from 'react';
import type { TaskStatus } from '../types';

// ── Button ──────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  loading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, children, className = '', ...props
}) => {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
    danger: 'bg-red-600/20 text-red-400 hover:bg-red-600/30',
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm' };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

// ── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
    <input
      className={`bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
);

// ── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}
export const Select: React.FC<SelectProps> = ({ label, children, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
    <select
      className={`bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

// ── Badge ────────────────────────────────────────────────────────────────────
const statusConfig: Record<TaskStatus, { label: string; cls: string }> = {
  TODO: { label: 'To Do', cls: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
  IN_PROGRESS: { label: 'In Progress', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  ON_HOLD: { label: 'On Hold', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  COMPLETED: { label: 'Completed', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};
export const StatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
  const { label, cls } = statusConfig[status] ?? statusConfig.TODO;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${cls}`}>{label}</span>;
};

// ── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin ${className}`} />
);

// ── Modal ────────────────────────────────────────────────────────────────────
export const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">{title}</h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none transition">✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon?: string; title: string; subtitle?: string }> = ({ icon = '📭', title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
    <span className="text-4xl mb-1">{icon}</span>
    <p className="text-slate-300 font-medium">{title}</p>
    {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
  </div>
);

// ── Pagination ───────────────────────────────────────────────────────────────
export const Pagination: React.FC<{ page: number; totalPages: number; onChange: (p: number) => void }> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <Button variant="ghost" size="sm" onClick={() => onChange(page - 1)} disabled={page === 0}>← Prev</Button>
      <span className="text-xs text-slate-500">{page + 1} / {totalPages}</span>
      <Button variant="ghost" size="sm" onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}>Next →</Button>
    </div>
  );
};