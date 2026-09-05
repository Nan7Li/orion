import React from 'react';
import { Topic } from '@/types';
import { CategoryBadge } from './CategoryBadge';
import { MessageSquare, Eye, Heart, Pin, Sparkles } from 'lucide-react';

interface TopicItemProps {
  topic: Topic;
  onClick: () => void;
  onTagClick: (tag: string) => void;
  onCategoryClick: (slug: string) => void;
}

export const formatRelativeTime = (dateStr: string): string => {
  if (!dateStr) return '刚刚';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  if (diffMs < 0) return '刚刚';
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays === 1) return '昨天';
  if (diffDays === 2) return '前天';
  if (diffDays < 30) return `${diffDays} 天前`;
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

export const TopicItem: React.FC<TopicItemProps> = ({
  topic,
  onClick,
  onTagClick,
  onCategoryClick,
}) => {
  return (
    <div className="group relative bg-white dark:bg-zinc-900/50 hover:bg-zinc-50/90 dark:hover:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Main info */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 mb-1.5">
            {topic.isPinned && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                <Pin className="w-3 h-3" />
                <span>置顶</span>
              </span>
            )}
            {topic.isFeatured && (
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="w-3 h-3" />
                <span>精选</span>
              </span>
            )}
            <h2
              onClick={onClick}
              className="text-[15px] sm:text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer leading-snug line-clamp-1"
            >
              {topic.title}
            </h2>
          </div>

          {/* Badges & Meta row */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-1 text-xs">
            <CategoryBadge
              category={topic.category}
              size="sm"
              clickable
              onClick={() => onCategoryClick(topic.category.slug)}
            />

            {topic.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
                className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors font-mono"
              >
                #{tag}
              </button>
            ))}

            <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">·</span>

            {/* Author */}
            <span className="text-zinc-500 dark:text-zinc-400 text-[12px] flex items-center space-x-1">
              <span>由</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {topic.author.name}
              </span>
              <span>发布</span>
            </span>
          </div>
        </div>

        {/* Right: Participants, Replies, Views, Activity */}
        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800/60">
          {/* Participants Avatars Stack */}
          <div className="flex -space-x-2 overflow-hidden items-center py-1">
            {topic.participants.slice(0, 4).map((p, idx) => (
              <div
                key={p.id + idx}
                className="relative inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-zinc-900 overflow-hidden bg-zinc-200"
                title={`${p.name} (${p.trustTitle})`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {topic.participants.length > 4 && (
              <div className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-zinc-900 bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500 flex items-center justify-center font-mono font-semibold">
                +{topic.participants.length - 4}
              </div>
            )}
          </div>

          {/* Stats: Replies & Views */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            {/* Replies Pill */}
            <div
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                topic.repliesCount > 0
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
              }`}
              title={`${topic.repliesCount} 条回复`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{topic.repliesCount}</span>
            </div>

            {/* Views */}
            <div
              className="flex items-center space-x-1 text-zinc-400 dark:text-zinc-500"
              title={`${topic.views} 次阅读`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{topic.views > 1000 ? `${(topic.views / 1000).toFixed(1)}k` : topic.views}</span>
            </div>

            {/* Likes */}
            <div
              className={`flex items-center space-x-1 ${
                topic.isLiked ? 'text-pink-500 font-bold' : 'text-zinc-400 dark:text-zinc-500'
              }`}
              title={`${topic.likes} 个点赞`}
            >
              <Heart className={`w-3.5 h-3.5 ${topic.isLiked ? 'fill-pink-500' : ''}`} />
              <span>{topic.likes}</span>
            </div>
          </div>

          {/* Relative Time */}
          <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono min-w-[54px] text-right">
            {formatRelativeTime(topic.lastActivityAt)}
          </div>
        </div>
      </div>
    </div>
  );
};
