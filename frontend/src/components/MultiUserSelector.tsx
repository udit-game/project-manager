import React, { useState, useEffect, useRef } from 'react';
import { useUserSearch } from '../hooks/useUsers';
import { Spinner } from './index';
import type { UserMinimal } from '../api/userApi';

interface MultiUserSelectorProps {
  label?: string;
  selectedUsers: UserMinimal[];
  onChange: (users: UserMinimal[]) => void;
}

export const MultiUserSelector: React.FC<MultiUserSelectorProps> = ({ 
  label, 
  selectedUsers, 
  onChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useUserSearch(debouncedQuery);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleSelect = (user: UserMinimal) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      onChange([...selectedUsers, user]);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange(selectedUsers.filter((u) => u.id !== id));
  };

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      {label && <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>}
      
      <div className="relative min-h-[42px] bg-white/5 border border-white/10 rounded-lg p-1.5 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-indigo-500/50 transition">
        {/* Selected User Tags */}
        {selectedUsers.map((user) => (
          <span 
            key={user.id} 
            className="flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md text-sm border border-indigo-500/30 animate-in fade-in zoom-in duration-200"
          >
            {user.email}
            <button
              type="button"
              onClick={() => handleRemove(user.id)}
              className="hover:text-white transition-colors leading-none"
            >
              ✕
            </button>
          </span>
        ))}

        {/* Search Input */}
        <input
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500 min-w-[120px] px-1.5"
          placeholder={selectedUsers.length === 0 ? "Search members..." : ""}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        {isLoading && (
          <div className="absolute right-3 top-3">
            <Spinner className="w-4 h-4" />
          </div>
        )}

        {/* Dropdown Results */}
        {isOpen && debouncedQuery.length >= 2 && (
          <div className="absolute top-full left-0 z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
            {searchResults?.length ? (
              searchResults.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={() => handleSelect(user)}
                >
                  {user.email}
                </button>
              ))
            ) : (
              !isLoading && (
                <div className="px-4 py-4 text-xs text-slate-500 italic text-center">
                  No users found for "{debouncedQuery}"
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};