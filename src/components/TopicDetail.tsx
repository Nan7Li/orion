'use client';

import React, { useState } from 'react';
import { useForum } from '@/context/ForumContext';
import { UserBadge } from './UserBadge';
import { CategoryBadge } from './CategoryBadge';
import { MarkdownRenderer } from './MarkdownRenderer';
import { EmojiReactions } from './EmojiReactions';
import { TopicTimeline } from './TopicTimeline';
import { UserPopover } from './UserPopover';
import { formatRelativeTime } from './TopicItem';
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  MessageSquare,
  Sparkles,
  Send,
  CornerDownRight,
  Pin,
  Eye,
  Loader2,
  Check,
  Quote,
} from 'lucide-react';

export const TopicDetail: React.FC = () => {
  const {
    activeTopic,
    setActiveTopicId,
    toggleLikeTopic,
    toggleBookmarkTopic,
    toggleLikeReply,
    toggleReactionTopic,
    toggleReactionReply,
    addReply,
    generateAiSummary,
    setSelectedCategory,
    currentUser,
    showToast,
  } = useForum();

  const [replyContent, setReplyContent] = useState('');
  const [replyToUser, setReplyToUser] = useState<string | null>(null);
  const [replyToContent, setReplyToContent] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isAiExpanded, setIsAiExpanded] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(1);

  if (!activeTopic) return null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      showToast('🔗 星际议题永久链接已复制到剪贴板！', 'success');
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      showToast('无法访问剪贴板，请手动复制浏览器地址栏', 'warning');
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingAi(true);
    try {
      await generateAiSummary(activeTopic.id);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    addReply(activeTopic.id, replyContent.trim(), replyToUser || undefined, replyToContent || undefined);
    setReplyContent('');
    setReplyToUser(null);
    setReplyToContent(null);
  };

  const handleJumpToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentFloor(1);
  };

  const handleJumpToBottom = () => {
    const el = document.getElementById('reply-composer');
    el?.scrollIntoView({ behavior: 'smooth' });
    setCurrentFloor(activeTopic.replies.length + 1);
  };

  return (
    <div className="flex-1 min-w-0 flex gap-6 items-start">
      {/* Main Post Stream Column */}
      <div className="flex-1 min-w-0 space-y-5">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTopicId(null)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回话题列表</span>
          </button>

          <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono">
            <button
              onClick={() => {
                setSelectedCategory(activeTopic.category.slug);
                setActiveTopicId(null);
              }}
              className="hover:text-indigo-500 hover:underline"
            >
              {activeTopic.category.name}
            </button>
            <span>/</span>
            <span className="truncate max-w-[200px] text-zinc-600 dark:text-zinc-300">
              #{activeTopic.id.replace('topic-', '')}
            </span>
          </div>
        </div>

        {/* Topic Title Header Banner */}
        <div className="bg-white dark:bg-[#121721] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <CategoryBadge category={activeTopic.category} size="md" />

            {activeTopic.isPinned && (
              <span className="inline-flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                <Pin className="w-3 h-3" />
                <span>置顶公告</span>
              </span>
            )}

            {activeTopic.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white leading-snug tracking-tight">
            {activeTopic.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
            <UserPopover user={activeTopic.author}>
              <UserBadge user={activeTopic.author} avatarSize="md" />
            </UserPopover>

            <div className="flex items-center space-x-4 font-mono text-zinc-400">
              <span>{new Date(activeTopic.createdAt).toLocaleDateString('zh-CN')}</span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{activeTopic.views}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{activeTopic.repliesCount}</span>
              </span>
            </div>
          </div>

          {/* Discourse AI Summary Card */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-sky-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-sky-950/30 rounded-2xl border border-indigo-500/30 p-4 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Orion AI 话题核心脉络与共识提炼</span>
              </div>
              {activeTopic.aiSummary ? (
                <button
                  onClick={() => setIsAiExpanded(!isAiExpanded)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  {isAiExpanded ? '收起摘要' : '展开摘要'}
                </button>
              ) : (
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingAi}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>AI 正在提炼...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>一键提炼摘要</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {activeTopic.aiSummary && isAiExpanded && (
              <div className="mt-3 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pl-1 whitespace-pre-line border-t border-indigo-500/20 pt-2.5 font-sans">
                {activeTopic.aiSummary}
              </div>
            )}
          </div>
        </div>

        {/* Post #1 (Original Post) */}
        <div className="bg-white dark:bg-[#121721] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
            <UserPopover user={activeTopic.author}>
              <UserBadge user={activeTopic.author} avatarSize="sm" />
            </UserPopover>
            <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono">
              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold">
                #1 楼主
              </span>
              <span>·</span>
              <span>{formatRelativeTime(activeTopic.createdAt)}</span>
            </div>
          </div>

          <div className="py-2">
            <MarkdownRenderer content={activeTopic.content} />
          </div>

          {/* Post #1 Emoji Reactions */}
          <div className="pt-2">
            <EmojiReactions
              reactions={activeTopic.reactions}
              currentUserId={currentUser.id}
              onReact={(emoji) => toggleReactionTopic(activeTopic.id, emoji)}
            />
          </div>

          {/* Action Buttons Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleLikeTopic(activeTopic.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  activeTopic.isLiked
                    ? 'bg-pink-50 dark:bg-pink-950/40 border-pink-500/40 text-pink-600 dark:text-pink-400'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${activeTopic.isLiked ? 'fill-pink-500' : ''}`} />
                <span>{activeTopic.likes}</span>
                <span className="hidden sm:inline">赞</span>
              </button>

              <button
                onClick={() => toggleBookmarkTopic(activeTopic.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  activeTopic.isBookmarked
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${activeTopic.isBookmarked ? 'fill-indigo-500' : ''}`} />
                <span className="hidden sm:inline">{activeTopic.isBookmarked ? '已收藏' : '收藏'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium transition-all"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">已复制</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">分享</span>
                  </>
                )}
              </button>
            </div>

            <a
              href="#reply-composer"
              className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold shadow-xs hover:opacity-90 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>回复楼主</span>
            </a>
          </div>
        </div>

        {/* Replies Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
              <span>社区回帖</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                {activeTopic.replies.length}
              </span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">Discourse 时间线排列</span>
          </div>

          {activeTopic.replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-white dark:bg-[#121721] rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserPopover user={reply.author}>
                    <UserBadge user={reply.author} avatarSize="sm" />
                  </UserPopover>

                  {reply.replyToUser && (
                    <span className="inline-flex items-center space-x-1 text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md font-medium">
                      <CornerDownRight className="w-3 h-3" />
                      <span>@{reply.replyToUser}</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs text-zinc-400 font-mono">
                  <span className="font-bold text-zinc-500">#{reply.floorNumber} 楼</span>
                  <span>·</span>
                  <span>{formatRelativeTime(reply.createdAt)}</span>
                </div>
              </div>

              {/* Quoted preview if exists */}
              {reply.replyToContent && (
                <div className="border-l-2 border-indigo-500/50 pl-3 py-1 bg-zinc-50 dark:bg-zinc-800/40 rounded-r-lg text-xs text-zinc-500 dark:text-zinc-400 italic">
                  <Quote className="w-3 h-3 inline mr-1 text-indigo-400" />
                  {reply.replyToContent.slice(0, 100)}...
                </div>
              )}

              <div className="text-sm pl-0 sm:pl-9 text-zinc-800 dark:text-zinc-200">
                <MarkdownRenderer content={reply.content} />
              </div>

              {/* Reply Reactions & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 pl-0 sm:pl-9">
                <EmojiReactions
                  reactions={reply.reactions}
                  currentUserId={currentUser.id}
                  onReact={(emoji) => toggleReactionReply(activeTopic.id, reply.id, emoji)}
                />

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleLikeReply(activeTopic.id, reply.id)}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      reply.isLiked
                        ? 'text-pink-500 font-bold bg-pink-50 dark:bg-pink-950/40'
                        : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${reply.isLiked ? 'fill-pink-500' : ''}`} />
                    <span>{reply.likes > 0 ? reply.likes : '赞'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReplyToUser(reply.author.name);
                      setReplyToContent(reply.content);
                      const composer = document.getElementById('reply-textarea');
                      composer?.focus();
                    }}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs text-zinc-400 hover:text-indigo-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>引用回复</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* In-page Reply Box */}
          <div
            id="reply-composer"
            className="bg-white dark:bg-[#121721] rounded-3xl border border-zinc-200/80 dark:border-zinc-800 p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  以 <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentUser.name}</span> 的身份回复
                </span>
              </div>

              {replyToUser && (
                <div className="flex items-center space-x-1.5 text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg">
                  <span>正在回复 @{replyToUser}</span>
                  <button
                    onClick={() => {
                      setReplyToUser(null);
                      setReplyToContent(null);
                    }}
                    className="hover:opacity-75 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-3">
              <textarea
                id="reply-textarea"
                rows={4}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="撰写你的回复（支持 Markdown 与代码块高亮，请遵守 Orion 社区公约）..."
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y font-mono"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-mono">
                  快捷键 Ctrl + Enter 发送
                </span>

                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>提交回复</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Discourse Vertical Timeline Progress Widget */}
      <TopicTimeline
        currentFloor={currentFloor}
        totalFloors={activeTopic.replies.length + 1}
        startDate={activeTopic.createdAt}
        lastDate={activeTopic.lastActivityAt}
        onJumpToTop={handleJumpToTop}
        onJumpToBottom={handleJumpToBottom}
      />
    </div>
  );
};
