'use client';

import React, { useState } from 'react';
import { useForum } from '@/context/ForumContext';
import { getTrustLevelBadge } from './UserBadge';
import {
  Menu,
  Search,
  Plus,
  Moon,
  Sun,
  Bell,
  Users,
  Layers,
  ChevronDown,
  Sparkles,
  LayoutList,
  LayoutGrid,
  Compass,
  MessageSquare,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    theme,
    toggleTheme,
    isSidebarCollapsed,
    toggleSidebar,
    displayMode,
    setDisplayMode,
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800 bg-white/95 dark:bg-[#0c1017]/95 backdrop-blur-md transition-colors">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle + Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-xl border transition-all ${
              isSidebarCollapsed
                ? 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
            }`}
            title="折叠/展开左侧导航栏"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogoClick}
            className="flex items-center space-x-2.5 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-sky-400 p-0.5 shadow-sm shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white font-mono">
                ORION
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-bold uppercase tracking-wider">
                DO
              </span>
            </div>
          </button>

          {/* Quick Category Selector */}
          <div className="relative hidden md:block ml-2">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {selectedCategory === 'all'
                  ? '全部话题'
                  : categories.find((c) => c.slug === selectedCategory)?.name || '分类'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showCategoryMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowCategoryMenu(false)} />
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl py-2 z-30 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    选择频道
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setActiveTopicId(null);
                        setShowCategoryMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors ${
                        selectedCategory === cat.slug
                          ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/40 dark:bg-indigo-950/30'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
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

        {/* Center: Search Bar Trigger */}
        <div className="flex-1 max-w-lg mx-2">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-400 dark:text-zinc-500 text-xs transition-all shadow-inner group"
          >
            <div className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
              <span className="text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200">
                搜索话题、星友、技术标签...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 shadow-xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Display Mode Toggle (Table / Card) */}
          <div className="hidden md:flex items-center p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80">
            <button
              onClick={() => setDisplayMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                displayMode === 'table'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title="Discourse 经典表格流"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDisplayMode('card')}
              className={`p-1.5 rounded-lg transition-all ${
                displayMode === 'card'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
              title="现代卡片流"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New Topic Button */}
          <button
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">发帖</span>
          </button>

          {/* Chat Mock */}
          <button
            onClick={() => alert('💬 Orion 社区实时群聊频道（Discourse Chat 模式）开发中，即将上线！')}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="实时群聊 (Chat)"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={theme === 'dark' ? '切换亮色模式' : '切换暗色模式'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>

          {/* Bell */}
          <button
            onClick={() => alert('🔔 暂无未读系统提醒')}
            className="p-1.5 sm:p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative"
            title="通知"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-1.5 p-0.5 pl-1 pr-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-indigo-500/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showUserDropdown && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowUserDropdown(false)} />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-3 z-30 animate-in fade-in zoom-in-95">
                  <div className="flex items-center space-x-3 p-2 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-indigo-500/40 flex-shrink-0">
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

                  <div className="space-y-1 mt-2">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setIsUserSwitcherOpen(true);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>星阶身份切换 (主权官 / 恒星守望者)</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        alert(`个人档案：${currentUser.name}\n等级：Lv.${currentUser.trustLevel} (${currentUser.trustTitle})`);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-xs rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5 text-sky-500" />
                      <span>查看个人主页</span>
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
