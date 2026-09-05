'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import { POPULAR_TAGS } from '@/data/initialData';
import {
  Flame,
  Clock,
  Sparkles,
  Bookmark,
  Hash,
  Activity,
  Layers,
  Award,
  Send,
} from 'lucide-react';
import { ViewTab } from '@/types';

export const Sidebar: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    activeTab,
    setActiveTab,
    setActiveTopicId,
  } = useForum();

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedTag(null);
    setActiveTopicId(null);
  };

  const handleSelectTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setActiveTopicId(null);
    }
  };

  const navItems: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { id: 'all', label: '全部话题', icon: Layers, color: 'text-indigo-500' },
    { id: 'latest', label: '最新发布', icon: Clock, color: 'text-sky-500' },
    { id: 'top', label: '热门榜单', icon: Flame, color: 'text-orange-500' },
    { id: 'featured', label: '精选推荐', icon: Sparkles, color: 'text-purple-500' },
    { id: 'bookmarks', label: '我的书签', icon: Bookmark, color: 'text-pink-500' },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      {/* 1. Quick Navigation */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-3 shadow-sm">
        <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-3 py-1.5">
          视图导航
        </div>
        <nav className="space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !selectedTag;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSelectedTag(null);
                  setActiveTopicId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'top' && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. Categories List */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-3 shadow-sm">
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            分类专区
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {categories.length} 个专区
          </span>
        </div>
        <div className="space-y-1 mt-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
                >
                  {cat.topicsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Tags Cloud */}
      <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 shadow-sm">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Hash className="w-3.5 h-3.5 text-zinc-400" />
            <span>活跃标签</span>
          </div>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] text-indigo-500 hover:underline"
            >
              清除筛选
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TAGS.map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                  isTagActive
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:border-indigo-400/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Community Live Stats */}
      <div className="bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent dark:from-indigo-950/20 dark:via-purple-950/20 rounded-2xl border border-indigo-500/20 p-4 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          <Activity className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>Orion 运行大盘</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              1,428
            </div>
            <div className="text-[10px] text-zinc-400">在线佬友</div>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              36
            </div>
            <div className="text-[10px] text-zinc-400">今日主题</div>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
              2,810
            </div>
            <div className="text-[10px] text-zinc-400">总回帖数</div>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="font-mono font-bold text-purple-600 dark:text-purple-400">
              248 天
            </div>
            <div className="text-[10px] text-zinc-400">稳定运行</div>
          </div>
        </div>
      </div>

      {/* 5. Footer & Links */}
      <div className="px-2 text-center space-y-2">
        <div className="flex items-center justify-center space-x-3 text-zinc-400 dark:text-zinc-500 text-xs">
          <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer flex items-center space-x-1">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </span>
          <span>·</span>
          <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer flex items-center space-x-1">
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </span>
          <span>·</span>
          <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer flex items-center space-x-1">
            <Award className="w-3.5 h-3.5" />
            <span>贡献榜</span>
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
          Orion Community © 2026. Powered by Next.js
        </p>
      </div>
    </aside>
  );
};
