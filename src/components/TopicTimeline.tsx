'use client';

import React from 'react';
import { ChevronUp, ChevronDown, Clock } from 'lucide-react';

interface TopicTimelineProps {
  currentFloor: number;
  totalFloors: number;
  startDate: string;
  lastDate: string;
  onJumpToTop: () => void;
  onJumpToBottom: () => void;
}

export const TopicTimeline: React.FC<TopicTimelineProps> = ({
  currentFloor,
  totalFloors,
  startDate,
  lastDate,
  onJumpToTop,
  onJumpToBottom,
}) => {
  const progressPercent = Math.min(100, Math.max(10, (currentFloor / totalFloors) * 100));

  return (
    <aside className="hidden xl:flex flex-col items-center w-24 flex-shrink-0 sticky top-24 self-start space-y-3 font-mono text-xs select-none">
      {/* Jump Top */}
      <button
        onClick={onJumpToTop}
        className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all"
        title="跳转到楼顶"
      >
        <ChevronUp className="w-4 h-4" />
      </button>

      {/* Start Date */}
      <span className="text-[10px] text-zinc-400">
        {new Date(startDate).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
      </span>

      {/* Vertical Track & Scroller Handle */}
      <div className="w-1.5 h-48 bg-zinc-200 dark:bg-zinc-800 rounded-full relative overflow-hidden my-1">
        <div
          className="w-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
          style={{ height: `${progressPercent}%` }}
        />
      </div>

      {/* Current Floor / Total */}
      <div className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] shadow-xs">
        {currentFloor} / {totalFloors}
      </div>

      {/* Last Date */}
      <span className="text-[10px] text-zinc-400">
        {new Date(lastDate).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
      </span>

      {/* Jump Bottom */}
      <button
        onClick={onJumpToBottom}
        className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-center text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all"
        title="跳转到楼底最新回复"
      >
        <ChevronDown className="w-4 h-4" />
      </button>

      <div className="pt-2 text-[10px] text-zinc-400 flex items-center space-x-1">
        <Clock className="w-3 h-3" />
        <span>时间轴</span>
      </div>
    </aside>
  );
};
