'use client';

import React, { useState } from 'react';
import { useForum } from '@/context/ForumContext';
import { getTrustLevelBadge } from './UserBadge';
import {
  Search,
  Plus,
  Moon,
  Sun,
  Bell,
  Compass,
  Users,
  Layers,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    theme,
    toggleTheme,
    setIsComposerOpen,
    setIsSearchModalOpen,
    setIsUserSwitcherOpen,
    setActiveTopicId,
    setSelectedCategory,
    categories,
    selectedCategory,
  } = useForum();

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const trust = getTrustLevelBadge(currentUser.trustLevel);
  const TrustIcon = trust.icon;

  const handleLogoClick = () => {
    setActiveTopicId(null);
    setSelectedCategory('all');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 p-0.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white font-mono">
                  ORION
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold uppercase">
                  DO
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 tracking-wider hidden sm:block">
                连接思想 · 星辰大海
              </p>
            </div>
          </button>

          {/* Quick Category Dropdown for Mobile / Compact */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center space-x-2 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {selectedCategory === 'all'
                  ? '全部话题'
                  : categories.find((c) => c.slug === selectedCategory)?.name || '分类浏览'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showCategoryMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowCategoryMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-56 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    选择分类频道
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setActiveTopicId(null);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors ${
                        selectedCategory === cat.slug
                          ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/50 dark:bg-indigo-950/20'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {cat.topicsCount}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center: Search Trigger */}
        <div className="flex-1 max-w-md mx-2">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-400 dark:text-zinc-500 text-xs transition-all shadow-inner group"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                搜索话题、佬友、技术标签...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shadow-sm">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Create Topic Button */}
          <button
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">发帖</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
            title={theme === 'dark' ? '切换亮色模式' : '切换暗色模式'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>

          {/* Notifications Placeholder */}
          <button
            onClick={() => alert('🔔 暂无未读系统提醒，社区运转平稳！')}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors relative"
            title="通知中心"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>

          {/* User Profile & Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 transition-colors"
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:flex flex-col items-start text-left">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  Lv.{currentUser.trustLevel} {trust.label}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400 hidden sm:block" />
            </button>

            {showUserDropdown && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowUserDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-3 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center space-x-3 p-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {currentUser.name}
                      </p>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <TrustIcon className="w-3 h-3 text-amber-500" />
                        <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                          {currentUser.trustTitle}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-2.5 px-1 text-center">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                        {currentUser.topicsCount}
                      </div>
                      <div className="text-[10px] text-zinc-400">发布主题</div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <div className="text-xs font-bold text-pink-600 dark:text-pink-400 font-mono">
                        {currentUser.likesReceived}
                      </div>
                      <div className="text-[10px] text-zinc-400">获赞总数</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsUserSwitcherOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>切换测试身份 (始皇/核心佬友)</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        alert(`个人主页：${currentUser.name}\n简介：${currentUser.bio || '无'}\n注册于：${currentUser.joinedAt}`);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-sky-500" />
                      <span>查看个人档案</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
