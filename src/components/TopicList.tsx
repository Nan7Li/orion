'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import { TopicItem, formatRelativeTime } from './TopicItem';
import { CategoryBadge } from './CategoryBadge';
import { UserPopover } from './UserPopover';
import { LiveActivityTicker } from './LiveActivityTicker';
import { Layers, X, PlusCircle, Filter, Pin, Sparkles } from 'lucide-react';
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
    displayMode,
  } = useForum();

  const currentCategory = categories.find((c) => c.slug === selectedCategory);

  const tabs: { id: ViewTab; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'latest', label: '最新' },
    { id: 'top', label: '热门' },
    { id: 'featured', label: '精选' },
    { id: 'unread', label: '未读' },
    { id: 'bookmarks', label: '我的书签' },
  ];

  return (
    <div className="flex-1 min-w-0 space-y-4">
      {/* Category Header Banner */}
      {selectedCategory !== 'all' && currentCategory && (
        <div
          style={{
            borderColor: `${currentCategory.color}40`,
            background: `linear-gradient(135deg, ${currentCategory.bgColor}, transparent)`,
          }}
          className="p-4 rounded-2xl border flex items-center justify-between transition-all shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <span
              className="w-3.5 h-3.5 rounded-[3px]"
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

      {/* Active Filter status */}
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

      {/* Live Activity & Community Pulse Stream */}
      <LiveActivityTicker />

      {/* Discourse Nav Bar */}
      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850'
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

      {/* Discourse Classic Table Mode */}
      {filteredTopics.length > 0 ? (
        displayMode === 'table' ? (
          <div className="bg-white dark:bg-[#121721] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2.5 bg-zinc-50 dark:bg-[#0c1017]/80 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <div className="col-span-7">话题</div>
              <div className="col-span-2 text-center">在轨漫游者</div>
              <div className="col-span-1 text-center">回复</div>
              <div className="col-span-1 text-center">浏览</div>
              <div className="col-span-1 text-right">活动</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="px-4 py-3 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group flex flex-col sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center gap-2"
                  onClick={() => setActiveTopicId(topic.id)}
                >
                  {/* Title & Category & Tags (Col 1-7) */}
                  <div className="sm:col-span-7 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      {topic.isPinned && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          <Pin className="w-2.5 h-2.5" />
                          <span>置顶</span>
                        </span>
                      )}
                      {topic.isFeatured && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>精选</span>
                        </span>
                      )}
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {topic.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2 mt-1.5 flex-wrap gap-y-1 text-xs">
                      <CategoryBadge
                        category={topic.category}
                        size="sm"
                        clickable
                        onClick={() => setSelectedCategory(topic.category.slug)}
                      />
                      {topic.tags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTag(tag);
                          }}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 font-mono"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Participants Avatars (Col 8-9) */}
                  <div className="sm:col-span-2 flex items-center sm:justify-center -space-x-1.5 overflow-hidden">
                    {topic.participants.slice(0, 4).map((p, idx) => (
                      <UserPopover key={p.id + idx} user={p}>
                        <div className="relative inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#121721] overflow-hidden bg-zinc-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      </UserPopover>
                    ))}
                    {topic.participants.length > 4 && (
                      <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-[#121721] bg-zinc-100 dark:bg-zinc-800 text-[9px] text-zinc-500 flex items-center justify-center font-mono font-bold">
                        +{topic.participants.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Replies (Col 10) */}
                  <div className="sm:col-span-1 text-left sm:text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                        topic.repliesCount > 0
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                          : 'text-zinc-400'
                      }`}
                    >
                      {topic.repliesCount}
                    </span>
                  </div>

                  {/* Views (Col 11) */}
                  <div className="sm:col-span-1 text-left sm:text-center text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    {topic.views > 1000 ? `${(topic.views / 1000).toFixed(1)}k` : topic.views}
                  </div>

                  {/* Last Activity (Col 12) */}
                  <div className="sm:col-span-1 text-left sm:text-right text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
                    {formatRelativeTime(topic.lastActivityAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Card View Mode */
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
          </div>
        )
      ) : (
        <div className="text-center py-16 px-4 bg-white dark:bg-zinc-900/40 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            暂无匹配的话题
          </h3>
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
