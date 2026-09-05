'use client';

import React from 'react';
import { useForum } from '@/context/ForumContext';
import { X, Sparkles, Orbit, Compass, Sun, ShieldAlert, Check } from 'lucide-react';

const LEVELS = [
  {
    level: 0,
    name: '星尘观测者',
    enName: 'Stardust Observer',
    icon: Orbit,
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.1)',
    req: '刚进入猎户座星系',
    privileges: ['浏览全星域公开话题', '学习社区星舰公约', '加入公共频道接收广播'],
  },
  {
    level: 1,
    name: '星际漫游者',
    enName: 'Cosmos Voyager',
    icon: Compass,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    req: '浏览 5 个话题，累计在轨阅读 15 分钟',
    privileges: ['日常星轨发帖与参与回帖', '话题表情点赞与互动 (Reaction)', '使用星标书签收藏', '参与公共频道聊天'],
  },
  {
    level: 2,
    name: '行星领航员',
    enName: 'Planetary Navigator',
    icon: Compass,
    color: '#4ade80',
    bg: 'rgba(74, 222, 128, 0.1)',
    req: '活跃 15 天，获得 20 次点赞，无违规记录',
    privileges: ['获得星际跃迁邀请码', '编辑个性化星际档案与外链', '点赞权重加倍 (x1.5)', '发起公约投票讨论'],
  },
  {
    level: 3,
    name: '恒星守望者',
    enName: 'Stellar Warden',
    icon: Sun,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.1)',
    req: '连续在轨 50 天，发布过 3 篇精选星标议题',
    privileges: ['议题标签协作治理与重分类', '提名星域精选内容', '参与社区星域管理投票', '优先获取生态补给福利'],
  },
  {
    level: 4,
    name: '猎户座主权官',
    enName: 'Orion Sovereign',
    icon: ShieldAlert,
    color: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.12)',
    req: '创世领航员 / 核心代码贡献者',
    privileges: ['全星域置顶与锁定管理', '全网技术议程发起权', '星舰全局治理与特权执行', '社区基础设施运维直连'],
  },
];

export const LevelMatrixModal: React.FC = () => {
  const { isLevelMatrixOpen, setIsLevelMatrixOpen, currentUser } = useForum();

  if (!isLevelMatrixOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={() => setIsLevelMatrixOpen(false)}
      />

      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0e131d] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                🌌 猎户座宇宙星阶白皮书 (Cosmic Hierarchy)
              </h2>
              <p className="text-xs text-zinc-400">基于天体引力与贡献沉淀的信任阶梯体系</p>
            </div>
          </div>

          <button
            onClick={() => setIsLevelMatrixOpen(false)}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3.5">
            {LEVELS.map((lvl) => {
              const Icon = lvl.icon;
              const isCurrent = currentUser ? currentUser.trustLevel === lvl.level : false;

              return (
                <div
                  key={lvl.level}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-2 ring-indigo-500/30'
                      : 'border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: lvl.bg, color: lvl.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className="font-black text-sm"
                            style={{ color: lvl.color }}
                          >
                            Lv.{lvl.level} {lvl.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            {lvl.enName}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
                              您当前所处星阶
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          达成条件：{lvl.req}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2">
                    {lvl.privileges.map((priv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                      >
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>{priv}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400">
          <span>持续发表有深度的高质量干货，是跃迁高阶星环的唯一轨道。</span>
          <button
            onClick={() => setIsLevelMatrixOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
          >
            知悉星舰规约
          </button>
        </div>
      </div>
    </div>
  );
};
