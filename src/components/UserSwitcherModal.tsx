'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import { getTrustLevelBadge } from './UserBadge';
import { X, CheckCircle2, Heart, FileText } from 'lucide-react';

export const UserSwitcherModal: React.FC = () => {
  const {
    isUserSwitcherOpen,
    setIsUserSwitcherOpen,
    users,
    currentUser,
    setCurrentUser,
  } = useForum();

  if (!isUserSwitcherOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setIsUserSwitcherOpen(false)}
      />

      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              宇宙星阶体验器 (Cosmic Persona Switcher)
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              你可以快速切换为不同天体星阶（猎户座主权官、恒星守望者、行星领航员）体验社区互动
            </p>
          </div>
          <button
            onClick={() => setIsUserSwitcherOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[65vh] overflow-y-auto">
          {users.map((user) => {
            const isSelected = currentUser?.id === user.id;
            const trust = getTrustLevelBadge(user.trustLevel);
            const TrustIcon = trust.icon;

            return (
              <div
                key={user.id}
                onClick={() => {
                  setCurrentUser(user);
                  setIsUserSwitcherOpen(false);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white">
                        {user.name}
                      </span>
                      <span
                        className={`inline-flex items-center space-x-1 text-[11px] px-2 py-0.2 rounded-full border font-medium ${trust.bg}`}
                      >
                        <TrustIcon className="w-3 h-3 flex-shrink-0" />
                        <span>Lv.{user.trustLevel}</span>
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {user.bio || '尚未设置个人简介'}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-zinc-400 font-mono mt-1">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{user.topicsCount} 帖子</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-pink-500" />
                        <span>{user.likesReceived} 获赞</span>
                      </span>
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>当前在线</span>
                  </div>
                ) : (
                  <button className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0">
                    切换到此身份
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 bg-zinc-50 dark:bg-zinc-950/60 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400 text-center">
          提示：切换身份后，后续发表的主题和回复将直接绑定该账号。
        </div>
      </div>
    </div>
  );
};
