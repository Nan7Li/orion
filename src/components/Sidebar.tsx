'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import { POPULAR_TAGS } from '@/data/initialData';
import { UserPopover } from './UserPopover';
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
  Eye,
  Heart,
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
    isSidebarCollapsed,
    users,
  } = useForum();

  if (isSidebarCollapsed) {
    return null;
  }

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
    { id: 'unread', label: '未读话题', icon: Eye, color: 'text-emerald-500' },
    { id: 'bookmarks', label: '我的书签', icon: Bookmark, color: 'text-pink-500' },
  ];

  return (
    <aside className="w-60 flex-shrink-0 space-y-5 animate-in fade-in slide-in-from-left-4 duration-200">
      {/* 1. Quick Navigation (Discourse Style) */}
      <div className="bg-white dark:bg-[#121721] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-2.5 shadow-xs">
        <div className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2.5 py-1">
          社区导航
        </div>
        <nav className="space-y-0.5 mt-1">
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
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'top' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 2. Categories with Discourse Square Badges */}
      <div className="bg-white dark:bg-[#121721] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-2.5 shadow-xs">
        <div className="flex items-center justify-between px-2.5 py-1">
          <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            分类频道
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {categories.length} 个
          </span>
        </div>
        <div className="space-y-0.5 mt-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-[2px] flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate">{cat.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80">
                  {cat.topicsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Top Active Members (Discourse Leaderboard) */}
      <div className="bg-white dark:bg-[#121721] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-3 shadow-xs">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>星际先锋榜</span>
          </div>
        </div>
        <div className="space-y-2">
          {users.slice(0, 4).map((u, idx) => (
            <div key={u.id} className="flex items-center justify-between text-xs">
              <UserPopover user={u}>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-zinc-400 w-3">
                    {idx + 1}
                  </span>
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[90px]">
                    {u.name.replace(/ \(.*\)/, '')}
                  </span>
                </div>
              </UserPopover>
              <div className="flex items-center space-x-1 text-zinc-400 font-mono text-[10px]">
                <Heart className="w-2.5 h-2.5 text-pink-500" />
                <span>{u.likesReceived}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Popular Tags Cloud */}
      <div className="bg-white dark:bg-[#121721] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-3 shadow-xs">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <Hash className="w-3 h-3 text-zinc-400" />
            <span>热门标签</span>
          </div>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[10px] text-indigo-500 hover:underline"
            >
              清除
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1">
          {POPULAR_TAGS.map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                  isTagActive
                    ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-indigo-400/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Live Stats */}
      <div className="bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent dark:from-indigo-950/20 dark:via-purple-950/20 rounded-2xl border border-indigo-500/20 p-3 shadow-xs">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>Orion 运行状态</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
          <div className="bg-white/80 dark:bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">1,428</div>
            <div className="text-[10px] text-zinc-400">在轨星友</div>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">36</div>
            <div className="text-[10px] text-zinc-400">今日主题</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-2 text-center text-[10px] text-zinc-400 dark:text-zinc-600 space-y-1">
        <div className="flex items-center justify-center space-x-2">
          <span className="hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer">关于 Orion</span>
          <span>·</span>
          <span className="hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer flex items-center space-x-0.5">
            <Send className="w-2.5 h-2.5" />
            <span>Telegram</span>
          </span>
        </div>
        <p>Orion DO · Powered by Discourse Architecture</p>
      </div>
    </aside>
  );
};
