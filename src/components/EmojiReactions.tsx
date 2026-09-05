'use client';

import React, { useState } from 'react';
import { Reaction } from '@/types';
import { SmilePlus } from 'lucide-react';

interface EmojiReactionsProps {
  reactions?: Reaction[];
  currentUserId: string;
  onReact: (emoji: string) => void;
}

const AVAILABLE_EMOJIS = [
  { emoji: '👍', name: '点赞' },
  { emoji: '❤️', name: '喜爱' },
  { emoji: '🚀', name: '起飞' },
  { emoji: '🎉', name: '庆祝' },
  { emoji: '💡', name: '启发' },
  { emoji: '🤯', name: '震撼' },
];

export const EmojiReactions: React.FC<EmojiReactionsProps> = ({
  reactions = [],
  currentUserId,
  onReact,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 relative">
      {/* Existing Reactions */}
      {reactions
        .filter((r) => r.count > 0)
        .map((r) => {
          const hasReacted = r.users.includes(currentUserId);
          return (
            <button
              key={r.emoji}
              onClick={() => onReact(r.emoji)}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium border transition-all duration-150 ${
                hasReacted
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-400 text-indigo-600 dark:text-indigo-400 shadow-xs scale-[1.02]'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:border-zinc-400'
              }`}
            >
              <span>{r.emoji}</span>
              <span className="text-[11px] font-semibold">{r.count}</span>
            </button>
          );
        })}

      {/* Add Reaction Button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          title="添加表态互动"
        >
          <SmilePlus className="w-3.5 h-3.5" />
          <span className="text-[11px] hidden sm:inline">表态</span>
        </button>

        {showPicker && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setShowPicker(false)}
            />
            <div className="absolute left-0 bottom-full mb-1.5 flex items-center space-x-1 p-1.5 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-xl z-30 animate-in fade-in zoom-in-95">
              {AVAILABLE_EMOJIS.map((item) => (
                <button
                  key={item.emoji}
                  onClick={() => {
                    onReact(item.emoji);
                    setShowPicker(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-base rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:scale-125 active:scale-95 transition-transform"
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
