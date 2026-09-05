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
import { Sparkles, Radio } from 'lucide-react';

const ForumMain: React.FC = () => {
  const { activeTopicId, setIsComposerOpen } = useForum();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc] dark:bg-[#090d16] transition-colors duration-200">
      <Header />

      {/* Community Announcement Broadcast Bar */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-sky-500/10 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-sky-950/20 border-b border-indigo-500/10 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-zinc-700 dark:text-zinc-300 truncate">
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse flex-shrink-0" />
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              [社区播报]
            </span>
            <span className="truncate">
              Orion 论坛全面上线：高仿真 Linux.do 风格设计、AI 智能摘要、Markdown 实时交互已就绪！
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

      {/* Main Forum Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Feed or Topic Detail */}
          <div className="flex-1 min-w-0 w-full">
            {activeTopicId ? <TopicDetail /> : <TopicList />}
          </div>

          {/* Sidebar */}
          <Sidebar />
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
