'use client';

import React, { useState, useEffect } from 'react';
import { useForum } from '@/context/ForumContext';
import { Activity, Flame, MessageSquare, Heart, Sparkles, UserCheck, ChevronRight } from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: 'reply' | 'topic' | 'like' | 'join' | 'feature' | 'badge';
  text: string;
  topicId?: string;
  timeAgo: string;
  tag?: string;
}

const SAMPLE_EVENTS: ActivityEvent[] = [
  {
    id: 'evt-1',
    type: 'reply',
    text: 'Neo 回复了议题《Cloudflare D1 边缘架构调优与实战》',
    topicId: 'topic-2',
    timeAgo: '2分钟前',
    tag: '边缘架构',
  },
  {
    id: 'evt-2',
    type: 'feature',
    text: '议题《DeepSeek-R1 本地量化部署实战》今日阅读突破 16,500',
    topicId: 'topic-3',
    timeAgo: '8分钟前',
    tag: '热门飙升',
  },
  {
    id: 'evt-3',
    type: 'join',
    text: '新探索者 @starlight 刚刚跃迁进入 Orion 星系',
    timeAgo: '14分钟前',
    tag: '新星跃迁',
  },
  {
    id: 'evt-4',
    type: 'like',
    text: 'Cygnus_极客 赞赏了《各大云厂商海外 VPS 线路全面实测》',
    topicId: 'topic-5',
    timeAgo: '20分钟前',
    tag: '干货好评',
  },
  {
    id: 'evt-5',
    type: 'topic',
    text: '矩阵漫步者 发布了议题《聊聊我们为什么把微服务全部迁回单体》',
    topicId: 'topic-4',
    timeAgo: '35分钟前',
    tag: '架构深度',
  },
  {
    id: 'evt-6',
    type: 'badge',
    text: '纯血运维漫游者 达成了【连续在轨 30 天】引力徽章',
    timeAgo: '1小时前',
    tag: '星轨成就',
  },
  {
    id: 'evt-7',
    type: 'reply',
    text: 'Nan7Li 在《Orion 开发者体验计划：领 API 额度》下发了 Token',
    topicId: 'topic-6',
    timeAgo: '1.5小时前',
    tag: '星际补给',
  },
];

export const LiveActivityTicker: React.FC = () => {
  const { setActiveTopicId } = useForum();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [onlineCount, setOnlineCount] = useState(486);

  // Dynamic online count slight fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(460, Math.min(520, prev + delta));
      });
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Event ticker rotation
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_EVENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const currentEvent = SAMPLE_EVENTS[currentIndex];

  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="w-3.5 h-3.5 text-sky-400" />;
      case 'feature':
        return <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />;
      case 'join':
        return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-pink-400" />;
      case 'badge':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const handleEventClick = () => {
    if (currentEvent.topicId) {
      setActiveTopicId(currentEvent.topicId);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-white/80 dark:bg-[#121721]/90 backdrop-blur-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-2 sm:px-3 sm:py-2 flex items-center justify-between shadow-xs transition-all"
    >
      {/* Left: Pulse Indicator & rotating event */}
      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
        {/* Pulsing Beacon */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-bold flex-shrink-0 border border-indigo-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          <span>实时脉冲</span>
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

      {/* Right: Online Explorers Counter */}
      <div className="flex items-center space-x-3 flex-shrink-0 pl-3 border-l border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          <span className="text-zinc-800 dark:text-zinc-200 font-bold">{onlineCount}</span>
          <span className="text-zinc-400 text-[10px] hidden sm:inline">在轨</span>
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
