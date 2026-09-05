'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { getTrustLevelBadge } from './UserBadge';
import { Calendar, Send } from 'lucide-react';

interface UserPopoverProps {
  user: User;
  children: React.ReactNode;
}

export const UserPopover: React.FC<UserPopoverProps> = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const trust = getTrustLevelBadge(user.trustLevel);
  const TrustIcon = trust.icon;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="cursor-pointer">{children}</div>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-72 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 pointer-events-auto">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-indigo-500/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                  {user.name}
                </h4>
                <p className="text-xs text-zinc-400 font-mono">@{user.username}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span
                    className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.2 rounded-full border font-medium ${trust.bg}`}
                  >
                    <TrustIcon className="w-2.5 h-2.5" />
                    <span>Lv.{user.trustLevel} {trust.label}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2.5 leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Badges row */}
          {user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              {user.badges.map((b) => (
                <span
                  key={b}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-medium"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1 mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs font-mono">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-1.5 rounded-lg">
              <div className="font-bold text-zinc-800 dark:text-zinc-200">
                {user.topicsCount}
              </div>
              <div className="text-[10px] text-zinc-400 font-sans">话题</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-1.5 rounded-lg">
              <div className="font-bold text-pink-500">{user.likesReceived}</div>
              <div className="text-[10px] text-zinc-400 font-sans">获赞</div>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-1.5 rounded-lg">
              <div className="font-bold text-indigo-500">Lv.{user.trustLevel}</div>
              <div className="text-[10px] text-zinc-400 font-sans">等级</div>
            </div>
          </div>

          {/* Joined date & message button */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>注册于 {user.joinedAt}</span>
            </div>
            <button
              onClick={() => alert(`已向 @${user.username} 发起私信通道`)}
              className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              <Send className="w-3 h-3" />
              <span>私信</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
