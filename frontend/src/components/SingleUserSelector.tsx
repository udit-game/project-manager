import React, { useState, useEffect, useRef } from 'react';
import { useUserSearch } from '../hooks/useUsers';
import { Spinner } from './index';

interface User {
  id: string;
  email: string;
}

interface UserSelectorProps {
  label?: string;
  value: string; // The selected UUID
  onSelect: (user: User | null) => void; 
  placeholder?: string;
}

export const SingleUserSelector: React.FC<UserSelectorProps> = ({ 
  label, 
  value, 
  onSelect,
  placeholder = "Select a user..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce logic (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: results, isLoading } = useUserSearch(debouncedQuery);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm(''); // Reset search if they click away
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEmail(null);
    onSelect(null);
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        <div 
          onClick={() => setIsOpen(true)}
          className={`
            relative w-full min-h-[42px] flex items-center gap-2 px-3 py-2
            bg-slate-900 border rounded-lg cursor-pointer transition-all duration-200
            ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-700 hover:border-slate-500'}
          `}
        >
          {/* Main Display Logic */}
          <div className="flex-1 flex items-center overflow-hidden">
            {value && !isOpen ? (
              <span className="text-sm text-slate-100 truncate">
                {selectedEmail || value}
              </span>
            ) : (
              <input
                autoFocus={isOpen}
                className="w-full bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500"
                placeholder={value ? selectedEmail || '' : placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>

          {/* Right-side Icons */}
          <div className="flex items-center gap-2 ml-2 border-l border-slate-700 pl-2">
            {isLoading ? (
              <Spinner className="w-4 h-4 text-indigo-400" />
            ) : value ? (
              <button 
                type="button" 
                onClick={handleClear}
                className="text-slate-500 hover:text-rose-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg 
                className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>

        {/* Dropdown Results */}
        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {results?.length ? (
                results.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
                    onClick={() => {
                      setSelectedEmail(user.email);
                      onSelect(user);
                      setSearchTerm('');
                      setIsOpen(false);
                    }}
                  >
                    <span className="truncate">{user.email}</span>
                    {value === user.id && (
                      <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-sm text-slate-500 text-center italic">
                  {debouncedQuery.length < 2 ? 'Type at least 2 characters...' : 'No users found'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};