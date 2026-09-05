'use client';

import React from 'react';
import { ForumProvider, useForum } from '@/context/ForumContext';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { TopicList } from '@/components/TopicList';
import { TopicDetail } from '@/components/TopicDetail';
import { ComposerDrawer } from '@/components/ComposerDrawer';
import { SearchModal } from '@/components/SearchModal';
import { UserSwitcherModal } from '@/components/UserSwitcherModal';
import { Radio, Sparkles } from 'lucide-react';

const ForumMain: React.FC = () => {
  const { activeTopicId, setIsComposerOpen } = useForum();

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa] dark:bg-[#0a0d14] transition-colors duration-200">
      <Header />

      {/* Community Announcement Broadcast Bar */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-sky-500/10 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-sky-950/20 border-b border-indigo-500/10 px-4 py-2">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300 truncate">
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse flex-shrink-0" />
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              [社区播报]
            </span>
            <span className="truncate">
              Orion 论坛 2.0 升级上线：支持 Discourse 经典表格流、时间轴、表情互动与 AI 速读！
            </span>
          </div>

          <button
            onClick={() => setIsComposerOpen(true)}
            className="hidden md:flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex-shrink-0 ml-4"
          >
            <Sparkles className="w-3 h-3" />
            <span>发布第一篇话题</span>
          </button>
        </div>
      </div>

      {/* Main Forum Content Layout: Left Sidebar + Center/Right Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 py-5">
        <div className="flex gap-6 items-start">
          {/* Left Sidebar */}
          <Sidebar />

          {/* Main Feed or Topic Detail */}
          <div className="flex-1 min-w-0">
            {activeTopicId ? <TopicDetail /> : <TopicList />}
          </div>
        </div>
      </main>

      {/* Global Interactive Overlays */}
      <ComposerDrawer />
      <SearchModal />
      <UserSwitcherModal />
    </div>
  );
};

export default function Home() {
  return (
    <ForumProvider>
      <ForumMain />
    </ForumProvider>
  );
}
