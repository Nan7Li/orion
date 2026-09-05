'use client';

import React, { useState, useEffect } from 'react';
import { useForum } from '@/context/ForumContext';
import { getTrustLevelBadge } from './UserBadge';
import {
  X,
  MapPin,
  Globe,
  Calendar,
  MessageSquare,
  Sparkles,
  Edit3,
  Save,
  Award,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { formatRelativeTime } from './TopicItem';

export const UserProfileModal: React.FC = () => {
  const {
    viewingUser,
    setViewingUser,
    currentUser,
    updateUserProfile,
    topics,
    setActiveTopicId,
    setIsLevelMatrixOpen,
  } = useForum();

  const [activeTab, setActiveTab] = useState<'activity' | 'edit'>('activity');

  // Form edit states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const targetUser = viewingUser || currentUser;
  const isSelf = !!(currentUser && targetUser && targetUser.id === currentUser.id);

  useEffect(() => {
    if (targetUser) {
      setName(targetUser.name);
      setBio(targetUser.bio || '');
      setLocation(targetUser.location || '');
      setWebsite(targetUser.website || '');
      setAvatar(targetUser.avatar || '');
    }
  }, [targetUser]);

  if (!viewingUser || !targetUser) return null;

  const trust = getTrustLevelBadge(targetUser.trustLevel);
  const TrustIcon = trust.icon;

  // Topics created by this user
  const userTopics = topics.filter((t) => t.author.id === targetUser.id);

  // Level progress calculation (e.g. for Lv.3 towards Lv.4)
  const currentLevel = targetUser.trustLevel;
  const nextLevelTitle =
    currentLevel === 0
      ? '星际漫游者 (Lv.1)'
      : currentLevel === 1
      ? '行星领航员 (Lv.2)'
      : currentLevel === 2
      ? '恒星守望者 (Lv.3)'
      : currentLevel === 3
      ? '猎户座主权官 (Lv.4)'
      : '已达星系至高主权';

  const progressPercent =
    currentLevel === 4 ? 100 : Math.min(95, Math.max(25, (targetUser.likesReceived / 1000) * 100));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar: avatar.trim(),
      });
      setActiveTab('activity');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={() => setViewingUser(null)}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0e131d] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Banner Cover */}
        <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 relative p-4 flex justify-between items-start">
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-indigo-300/80 uppercase">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ORION CELESTIAL PASSPORT · 猎户座星际通行证</span>
          </div>
          <button
            onClick={() => setViewingUser(null)}
            className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 -mt-12 sm:-mt-14 relative pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end space-x-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-[#0e131d] bg-zinc-900 shadow-xl flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white truncate">
                    {targetUser.name}
                  </h1>
                  <span className="text-xs text-zinc-400 font-mono">@{targetUser.username}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: `${trust.color}15`,
                      color: trust.color,
                      border: `1px solid ${trust.color}35`,
                    }}
                    onClick={() => setIsLevelMatrixOpen(true)}
                    title="点击查看宇宙星阶规则"
                  >
                    <TrustIcon className="w-3.5 h-3.5" />
                    <span>
                      Lv.{targetUser.trustLevel} · {targetUser.trustTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action button */}
            {isSelf && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab(activeTab === 'edit' ? 'activity' : 'edit')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{activeTab === 'edit' ? '返回动态' : '编辑档案'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
            {targetUser.bio || '这位星友还没有填写星际简介，仍在深空默默航行。'}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-3 pt-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>入轨日期 {targetUser.joinedAt}</span>
            </div>
            {targetUser.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{targetUser.location}</span>
              </div>
            )}
            {targetUser.website && (
              <a
                href={targetUser.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-indigo-500 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{targetUser.website.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          {/* Cosmic Hierarchy Progress Bar */}
          <div className="mt-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-zinc-700 dark:text-zinc-300">
                  星阶引力进度：{progressPercent.toFixed(0)}%
                </span>
              </div>
              <span className="text-zinc-400 font-mono text-[11px]">下一阶：{nextLevelTitle}</span>
            </div>
            <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'edit' && isSelf ? (
            /* Edit Form */
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">星际昵称 / 呼号</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">头像图片 URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">个人星际简介 (Bio)</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="记录你在星际中的技术栈、兴趣或个人项目..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">所在星域 / 坐标</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="例如：上海 / Orion Nebula"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">个人主页 / 博客</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="https://nan77a.com"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('activity')}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? '正在入轨 D1...' : '保存星际档案'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* User Activity & Topics */
            <div className="space-y-5">
              {/* Badges */}
              {targetUser.badges && targetUser.badges.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>已点亮星舰徽章</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {targetUser.badges.map((b, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics Created */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                    <span>发布的星际议题 ({userTopics.length})</span>
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    累计获赞 {targetUser.likesReceived}
                  </span>
                </h3>

                {userTopics.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-6 text-center">暂未发布过星轨话题</p>
                ) : (
                  <div className="space-y-2">
                    {userTopics.map((top) => (
                      <div
                        key={top.id}
                        onClick={() => {
                          setActiveTopicId(top.id);
                          setViewingUser(null);
                        }}
                        className="p-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-indigo-500/40 transition-all cursor-pointer text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-indigo-500 truncate">
                            {top.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-mono flex-shrink-0">
                            {formatRelativeTime(top.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 mt-2 text-[11px] text-zinc-400">
                          <span className="font-medium text-indigo-500">{top.category.name}</span>
                          <span>·</span>
                          <span>{top.repliesCount} 回复</span>
                          <span>·</span>
                          <span>{top.likes} 点赞</span>
                          <span>·</span>
                          <span>{top.views} 浏览</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
