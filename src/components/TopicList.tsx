'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import { TopicItem } from './TopicItem';
import { Layers, X, PlusCircle, Filter } from 'lucide-react';
import { ViewTab } from '@/types';

export const TopicList: React.FC = () => {
  const {
    filteredTopics,
    selectedCategory,
    setSelectedCategory,
    categories,
    selectedTag,
    setSelectedTag,
    activeTab,
    setActiveTab,
    setActiveTopicId,
    setIsComposerOpen,
    searchQuery,
    setSearchQuery,
  } = useForum();

  const currentCategory = categories.find((c) => c.slug === selectedCategory);

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'latest', label: '最新' },
    { id: 'top', label: '热门' },
    { id: 'featured', label: '精选' },
    { id: 'bookmarks', label: '我的书签' },
  ];

  return (
    <div className="flex-1 min-w-0 space-y-4">
      {/* Category Header Banner if a category is selected */}
      {selectedCategory !== 'all' && currentCategory && (
        <div
          style={{
            borderColor: `${currentCategory.color}40`,
            background: `linear-gradient(135deg, ${currentCategory.bgColor}, transparent)`,
          }}
          className="p-4 rounded-2xl border flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-3">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: currentCategory.color }}
            />
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
                <span>{currentCategory.name}</span>
                <span className="text-xs font-mono font-normal text-zinc-400">
                  ({currentCategory.topicsCount} 篇讨论)
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {currentCategory.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
            title="查看全部话题"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Filters bar (Tag or Search Query) */}
      {(selectedTag || searchQuery) && (
        <div className="flex items-center space-x-2 text-xs py-1 px-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <Filter className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-zinc-500 dark:text-zinc-400">正在过滤：</span>

          {selectedTag && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono">
              <span>#{selectedTag}</span>
              <button onClick={() => setSelectedTag(null)} className="hover:opacity-75">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span>关键词: &ldquo;{searchQuery}&rdquo;</span>
              <button onClick={() => setSearchQuery('')} className="hover:opacity-75">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={() => {
              setSelectedTag(null);
              setSearchQuery('');
            }}
            className="ml-auto text-indigo-500 hover:underline text-[11px]"
          >
            清除全部
          </button>
        </div>
      )}

      {/* Tab bar header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-zinc-400 font-mono hidden sm:block">
          共 {filteredTopics.length} 条话题
        </div>
      </div>

      {/* Topics list */}
      {filteredTopics.length > 0 ? (
        <div className="space-y-2.5">
          {filteredTopics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onClick={() => setActiveTopicId(topic.id)}
              onTagClick={(tag) => setSelectedTag(tag)}
              onCategoryClick={(slug) => setSelectedCategory(slug)}
            />
          ))}
          <div className="text-center py-6 text-xs text-zinc-400 dark:text-zinc-600 font-mono">
            ✦ 已展示全部社区话题 ✦
          </div>
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            暂无匹配的话题
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            未找到相关内容。你可以尝试清除筛选条件，或者抢先发布第一条话题！
          </p>
          <button
            onClick={() => setIsComposerOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>立即发布新话题</span>
          </button>
        </div>
      )}
    </div>
  );
};
