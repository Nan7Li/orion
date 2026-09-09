'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForum } from '@/context/ForumContext';
import { Flame, MessageSquare, Sparkles, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from './TopicItem';

interface ActivityEvent {
  id: string;
  type: 'reply' | 'topic' | 'feature';
  text: string;
  topicId?: string;
  timeAgo: string;
  tag?: string;
}

export const LiveActivityTicker: React.FC = () => {
  const { topics, setActiveTopicId } = useForum();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Generate genuine events directly from real loaded topics
  const realEvents: ActivityEvent[] = useMemo(() => {
    if (!topics || topics.length === 0) {
      return [
        {
          id: 'evt-init',
          type: 'feature',
          text: '欢迎来到 Orion 猎户座社区 · 数据已直连 Cloudflare D1 边缘数据库',
          timeAgo: '实时',
          tag: '边缘联通',
        },
      ];
    }

    const events: ActivityEvent[] = [];

    // Latest topics
    topics.slice(0, 10).forEach((t) => {
      if (t.repliesCount > 0) {
        events.push({
          id: `evt-rep-${t.id}`,
          type: 'reply',
          text: `议题《${t.title}》已有 ${t.repliesCount} 条交流回复`,
          topicId: t.id,
          timeAgo: formatRelativeTime(t.lastActivityAt),
          tag: t.tags?.[0] || t.category?.name,
        });
      } else if (t.isFeatured) {
        events.push({
          id: `evt-feat-${t.id}`,
          type: 'feature',
          text: `精选议题《${t.title}》· 欢迎参与技术探讨`,
          topicId: t.id,
          timeAgo: formatRelativeTime(t.createdAt),
          tag: '精选推荐',
        });
      } else {
        events.push({
          id: `evt-top-${t.id}`,
          type: 'topic',
          text: `${t.author?.name || '探索者'} 发布了议题《${t.title}》`,
          topicId: t.id,
          timeAgo: formatRelativeTime(t.createdAt),
          tag: t.tags?.[0] || t.category?.name,
        });
      }
    });

    return events.length > 0 ? events : [
      {
        id: 'evt-empty',
        type: 'feature',
        text: 'Orion 猎户座边缘社区已连通 · 欢迎发表第一个技术议题',
        timeAgo: '实时',
        tag: '星系联通',
      }
    ];
  }, [topics]);

  // Rotate through real events
  useEffect(() => {
    if (isPaused || realEvents.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % realEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, realEvents.length]);

  const safeIndex = currentIndex < realEvents.length ? currentIndex : 0;
  const currentEvent = realEvents[safeIndex];

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
      case 'feature':
        return <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const handleEventClick = () => {
    if (currentEvent?.topicId) {
      setActiveTopicId(currentEvent.topicId);
    }
  };

  if (!currentEvent) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-white/80 dark:bg-[#121721]/90 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-2 sm:px-3 sm:py-2 flex items-center justify-between shadow-xs transition-all"
    >
      {/* Left: Real Pulse Indicator & rotating event */}
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        {/* Pulsing Beacon */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold flex-shrink-0 border border-indigo-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span>实时动态</span>
        </div>

        {/* Current Event Item */}
        <div
          onClick={handleEventClick}
          className={`flex items-center space-x-2 min-w-0 flex-1 truncate transition-opacity duration-300 ${
            currentEvent.topicId ? 'cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400' : ''
          }`}
        >
          <div className="flex-shrink-0">{getIcon(currentEvent.type)}</div>
          <span className="text-xs text-zinc-700 dark:text-zinc-300 truncate font-medium">
            {currentEvent.text}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono flex-shrink-0 hidden md:inline">
            · {currentEvent.timeAgo}
          </span>
          {currentEvent.tag && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono flex-shrink-0 hidden lg:inline">
              #{currentEvent.tag}
            </span>
          )}
        </div>
      </div>

      {/* Right: Real Edge Status & Topics count */}
      <div className="flex items-center space-x-3 flex-shrink-0 pl-3 border-l border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-zinc-800 dark:text-zinc-200 font-bold">{topics.length}</span>
          <span className="text-zinc-400 text-[10px] hidden sm:inline">篇议题</span>
        </div>

        {currentEvent.topicId && (
          <button
            onClick={handleEventClick}
            className="p-1 rounded-lg text-zinc-400 hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors hidden sm:block"
            title="查看此议题"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
