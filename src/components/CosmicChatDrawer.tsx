'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForum } from '@/context/ForumContext';
import { X, Send, Radio } from 'lucide-react';
import { getTrustLevelBadge } from './UserBadge';

interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    trustLevel: 0 | 1 | 2 | 3 | 4;
    trustTitle: string;
  };
  content: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-system',
    sender: {
      id: 'system',
      name: 'Orion 猎户座公频系统',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      trustLevel: 4,
      trustTitle: '猎户座主权官',
    },
    content: '欢迎进入猎户座公频。真实探索者可在此自由交流技术经验、探讨边缘架构与星际见闻。',
    time: '实时',
  },
];

export const CosmicChatDrawer: React.FC = () => {
  const { isChatDrawerOpen, setIsChatDrawerOpen, currentUser, setIsAuthModalOpen } = useForum();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('orion_chat_messages_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_MESSAGES;
  });
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('orion_chat_messages_v2', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (isChatDrawerOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatDrawerOpen]);

  if (!isChatDrawerOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true, 'login');
      return;
    }
    if (!input.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        trustLevel: currentUser.trustLevel,
        trustTitle: currentUser.trustTitle,
      },
      content: input.trim(),
      time: timeStr,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
        onClick={() => setIsChatDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-[#0f141d] border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-gradient-to-r from-indigo-950/30 via-transparent to-transparent">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center relative">
              <Radio className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                  猎户座星际公频 (Cosmic Chat)
                </h2>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                <span className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>边缘多节点联通</span>
                </span>
                <span>·</span>
                <span className="font-mono text-zinc-500">1420.405 MHz</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsChatDrawerOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
          {messages.map((m) => {
            const isMe = currentUser ? m.sender.id === currentUser.id : false;
            const trust = getTrustLevelBadge(m.sender.trustLevel);

            return (
              <div
                key={m.id}
                className={`flex items-start space-x-2.5 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-700 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.sender.avatar} alt={m.sender.name} className="w-full h-full object-cover" />
                </div>
                <div className={`max-w-[78%] ${isMe ? 'text-right' : ''}`}>
                  <div className="flex items-center space-x-1.5 mb-1 justify-start">
                    <span className="font-bold text-[11px] text-zinc-800 dark:text-zinc-200 truncate">
                      {m.sender.name}
                    </span>
                    <span
                      className="text-[9px] font-bold px-1 rounded"
                      style={{ backgroundColor: `${trust.color}18`, color: trust.color }}
                    >
                      Lv.{m.sender.trustLevel}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{m.time}</span>
                  </div>
                  <div
                    className={`p-2.5 rounded-2xl leading-relaxed break-words text-left ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-xs'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Chat Input Bar */}
        {currentUser ? (
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="发送星际广播，全频道实时接收..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
            <span className="text-xs text-zinc-400">登入后即可参与公频实时交流</span>
            <button
              onClick={() => setIsAuthModalOpen(true, 'login')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              登入参与
            </button>
          </div>
        )}
      </div>
    </>
  );
};
