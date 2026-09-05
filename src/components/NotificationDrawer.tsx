'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import {
  Bell,
  X,
  CheckCheck,
  MessageSquare,
  Heart,
  Sparkles,
  Award,
  AtSign,
  ExternalLink,
} from 'lucide-react';
import { formatRelativeTime } from './TopicItem';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markAllNotificationsRead,
    setActiveTopicId,
  } = useForum();

  if (!isNotificationsOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (topicId?: string) => {
    if (topicId) {
      setActiveTopicId(topicId);
      setIsNotificationsOpen(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
        onClick={() => setIsNotificationsOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#0f141d] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center space-x-2">
                <span>星舰引力通知</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white">
                    {unreadCount} 未读
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-zinc-400">实时同步您的回复、赞赏与星阶跃迁</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                title="全部标记为已读"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>已读</span>
              </button>
            )}
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-zinc-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">暂时没有新的星际引力广播</p>
            </div>
          ) : (
            notifications.map((notif) => {
              let Icon = Sparkles;
              let iconBg = 'bg-indigo-500/10 text-indigo-500';

              if (notif.type === 'reply') {
                Icon = MessageSquare;
                iconBg = 'bg-sky-500/10 text-sky-500';
              } else if (notif.type === 'like') {
                Icon = Heart;
                iconBg = 'bg-rose-500/10 text-rose-500';
              } else if (notif.type === 'level_up') {
                Icon = Sparkles;
                iconBg = 'bg-amber-500/10 text-amber-500';
              } else if (notif.type === 'badge') {
                Icon = Award;
                iconBg = 'bg-emerald-500/10 text-emerald-500';
              } else if (notif.type === 'mention') {
                Icon = AtSign;
                iconBg = 'bg-purple-500/10 text-purple-500';
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.topicId)}
                  className={`p-3.5 rounded-2xl border transition-all text-xs cursor-pointer ${
                    notif.isRead
                      ? 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/60 dark:border-zinc-800/60 opacity-80'
                      : 'bg-white dark:bg-zinc-850/80 border-indigo-500/30 dark:border-indigo-500/40 shadow-xs'
                  } hover:border-indigo-500/60`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-xl flex-shrink-0 ${iconBg}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono flex-shrink-0">
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed break-words">
                        {notif.content}
                      </p>
                      {notif.topicId && (
                        <div className="mt-2 flex items-center space-x-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                          <span>跳转查看话题</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 text-center text-[11px] text-zinc-400">
          Orion 实时通信架构由 Cloudflare Edge & D1 驱动
        </div>
      </div>
    </>
  );
};
