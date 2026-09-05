'use client';

import React, { useState, useEffect } from 'react';
import { useForum } from '@/context/ForumContext';
import { Sparkles, Zap, CheckCircle2, Calendar, Award } from 'lucide-react';

interface CheckinState {
  lastDate: string;
  streak: number;
  energy: number;
}

export const DailyCheckinCard: React.FC = () => {
  const { currentUser, isLoggedIn, setIsAuthModalOpen, showToast } = useForum();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [streak, setStreak] = useState(6);
  const [energy, setEnergy] = useState(1240);
  const [isAnimating, setIsAnimating] = useState(false);

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  };

  useEffect(() => {
    try {
      const today = getTodayStr();
      const raw = localStorage.getItem('orion_checkin_state');
      if (raw) {
        const data: CheckinState = JSON.parse(raw);
        if (data.lastDate === today) {
          setIsCheckedIn(true);
          setStreak(data.streak || 7);
          setEnergy(data.energy || 1255);
        } else {
          // Check if streak broke (>1 day)
          const last = new Date(data.lastDate).getTime();
          const now = new Date(today).getTime();
          const diffDays = Math.round((now - last) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            setStreak(data.streak || 6);
          } else {
            setStreak(1);
          }
          setEnergy(data.energy || 1240);
          setIsCheckedIn(false);
        }
      } else {
        setStreak(6);
        setEnergy(1240);
        setIsCheckedIn(false);
      }
    } catch {}
  }, [currentUser]);

  const handleCheckin = () => {
    if (!isLoggedIn) {
      showToast('请先登入星舰，即可激活每日引力打卡并累积跃迁能量', 'warning');
      setIsAuthModalOpen(true, 'login');
      return;
    }

    if (isCheckedIn) return;

    setIsAnimating(true);
    const today = getTodayStr();
    const nextStreak = streak + 1;
    const nextEnergy = energy + 15;

    const newState: CheckinState = {
      lastDate: today,
      streak: nextStreak,
      energy: nextEnergy,
    };

    localStorage.setItem('orion_checkin_state', JSON.stringify(newState));
    setIsCheckedIn(true);
    setStreak(nextStreak);
    setEnergy(nextEnergy);

    setTimeout(() => {
      setIsAnimating(false);
      showToast(
        `🌌 跃迁打卡成功！猎户能量 +15，连续在轨 ${nextStreak} 天，引力场共振中！`,
        'success'
      );
    }, 400);
  };

  const todayChinese = new Date().toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-zinc-900/40 border border-indigo-500/20 p-3.5 shadow-sm">
      {/* Ambient background glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-100">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>今日星际引力场</span>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-zinc-400 font-mono">
          <Calendar className="w-3 h-3 text-zinc-400" />
          <span>{todayChinese}</span>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/60 dark:bg-zinc-900/60 rounded-xl p-2 border border-zinc-200/60 dark:border-zinc-800/60 text-center">
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center justify-center space-x-1">
            <Award className="w-3 h-3 text-indigo-400" />
            <span>连续在轨</span>
          </div>
          <div className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400 mt-0.5">
            {streak} <span className="text-[10px] font-normal text-zinc-400">天</span>
          </div>
        </div>

        <div className="bg-white/60 dark:bg-zinc-900/60 rounded-xl p-2 border border-zinc-200/60 dark:border-zinc-800/60 text-center">
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center justify-center space-x-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>引力能量</span>
          </div>
          <div className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400 mt-0.5">
            {energy} <span className="text-[10px] font-normal text-zinc-400">⚡</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isCheckedIn ? (
        <div className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>今日已完成引力共振</span>
        </div>
      ) : (
        <button
          onClick={handleCheckin}
          disabled={isAnimating}
          className={`w-full relative group overflow-hidden py-2 px-3 rounded-xl text-xs font-bold text-white shadow-md transition-all duration-200 flex items-center justify-center space-x-1.5 ${
            isAnimating
              ? 'scale-95 bg-indigo-700'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 active:scale-98'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isAnimating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
          <span>{isLoggedIn ? '跃迁打卡 (+15 能量)' : '登入激活每日打卡'}</span>
        </button>
      )}

      {/* Bottom Hint */}
      <div className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 mt-2 font-mono">
        {isCheckedIn
          ? '明日打卡可得 +20 能量 · 离下阶段跃迁仅差 80 能量'
          : '每日打卡累积引力值，加速宇宙星阶晋升'}
      </div>
    </div>
  );
};
