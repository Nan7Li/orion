'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForum } from '@/context/ForumContext';
import { CategoryBadge } from './CategoryBadge';
import { Search, X, MessageSquare, ArrowRight, CornerDownLeft } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    topics,
    setActiveTopicId,
  } = useForum();

  const [term, setTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setTerm('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const results = term.trim()
    ? topics.filter((t) => {
        const q = term.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.author.name.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.category.name.toLowerCase().includes(q)
        );
      })
    : topics.slice(0, 5); // show recent 5 by default

  const handleSelectTopic = (id: string) => {
    setActiveTopicId(id);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setIsSearchModalOpen(false)}
      />

      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="搜索 Orion 话题、技术标签、作者或关键字..."
            className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
          />
          {term && (
            <button
              onClick={() => setTerm('')}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
            ESC 退出
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {results.length > 0 ? (
            results.map((topic) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer group flex items-start justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CategoryBadge category={topic.category} size="sm" />
                    <span className="text-xs text-zinc-400">by {topic.author.name}</span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                    {topic.content.replace(/[#*`>-]/g, '')}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-zinc-400 flex-shrink-0 pt-2">
                  <div className="flex items-center space-x-1 text-xs font-mono">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{topic.repliesCount}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 text-indigo-500 transition-transform opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-zinc-400 text-xs">
              没有找到与 &ldquo;{term}&rdquo; 相关的话题，换个关键词试试？
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
          <span>共找到 {results.length} 条匹配结果</span>
          <div className="flex items-center space-x-1">
            <CornerDownLeft className="w-3 h-3" />
            <span>回车或点击直接跳转</span>
          </div>
        </div>
      </div>
    </div>
  );
};
