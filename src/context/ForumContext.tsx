'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Reply, Topic, User, ViewTab } from '@/types';
import { CATEGORIES, INITIAL_TOPICS, INITIAL_USERS } from '@/data/initialData';

interface ForumContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  categories: Category[];
  topics: Topic[];
  selectedCategory: string;
  setSelectedCategory: (slug: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTopicId: string | null;
  setActiveTopicId: (id: string | null) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isComposerOpen: boolean;
  setIsComposerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isUserSwitcherOpen: boolean;
  setIsUserSwitcherOpen: (open: boolean) => void;
  addTopic: (title: string, categorySlug: string, tags: string[], content: string) => Topic;
  addReply: (topicId: string, content: string, replyToUser?: string) => void;
  toggleLikeTopic: (topicId: string) => void;
  toggleBookmarkTopic: (topicId: string) => void;
  toggleLikeReply: (topicId: string, replyId: string) => void;
  generateAiSummary: (topicId: string) => Promise<string>;
  filteredTopics: Topic[];
  activeTopic: Topic | null;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOPICS: 'orion_forum_topics_v1',
  CURRENT_USER: 'orion_forum_current_user_v1',
  THEME: 'orion_forum_theme_v1',
};

export const ForumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[5]); // Default: OrionExplorer
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState<boolean>(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedTopics = localStorage.getItem(STORAGE_KEYS.TOPICS);
      if (savedTopics) {
        const parsed = JSON.parse(savedTopics);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTopics(parsed);
        }
      }

      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          setCurrentUser(parsedUser);
        }
      }

      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (e) {
      console.warn('Failed to load forum state from localStorage', e);
    }
  }, []);

  // Update theme class on HTML
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist topics
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
    } catch (e) {
      console.warn('Failed to persist topics', e);
    }
  }, [topics]);

  // Persist current user
  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist user', e);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTopic = (title: string, categorySlug: string, tags: string[], content: string): Topic => {
    const cat = categories.find((c) => c.slug === categorySlug) || categories[1];
    const now = new Date().toISOString();
    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      title,
      category: cat,
      tags: tags.length > 0 ? tags : ['讨论'],
      author: currentUser,
      content,
      createdAt: now,
      lastActivityAt: now,
      views: 1,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      isPinned: false,
      isFeatured: false,
      repliesCount: 0,
      participants: [currentUser],
      replies: [],
    };

    setTopics((prev) => [newTopic, ...prev]);
    return newTopic;
  };

  const addReply = (topicId: string, content: string, replyToUser?: string) => {
    const now = new Date().toISOString();
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      topicId,
      author: currentUser,
      content,
      createdAt: now,
      likes: 0,
      isLiked: false,
      replyToUser,
    };

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const participantExists = t.participants.some((p) => p.id === currentUser.id);
          const updatedParticipants = participantExists
            ? t.participants
            : [...t.participants, currentUser];
          return {
            ...t,
            lastActivityAt: now,
            repliesCount: t.repliesCount + 1,
            participants: updatedParticipants,
            replies: [...t.replies, newReply],
          };
        }
        return t;
      })
    );
  };

  const toggleLikeTopic = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const wasLiked = !!t.isLiked;
          return {
            ...t,
            isLiked: !wasLiked,
            likes: wasLiked ? Math.max(0, t.likes - 1) : t.likes + 1,
          };
        }
        return t;
      })
    );
  };

  const toggleBookmarkTopic = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            isBookmarked: !t.isBookmarked,
          };
        }
        return t;
      })
    );
  };

  const toggleLikeReply = (topicId: string, replyId: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            replies: t.replies.map((r) => {
              if (r.id === replyId) {
                const wasLiked = !!r.isLiked;
                return {
                  ...r,
                  isLiked: !wasLiked,
                  likes: wasLiked ? Math.max(0, r.likes - 1) : r.likes + 1,
                };
              }
              return r;
            }),
          };
        }
        return t;
      })
    );
  };

  const generateAiSummary = async (topicId: string): Promise<string> => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return '';

    if (topic.aiSummary) return topic.aiSummary;

    // Simulate AI generation with intelligent parsing
    await new Promise((res) => setTimeout(res, 800));

    const summary = `【Orion AI 智能摘要】
1. **核心议题**：围绕《${topic.title}》展开讨论，发帖人 @${topic.author.name} 重点分析了关键背景与实践方案。
2. **社区共识**：讨论中 ${topic.replies.length} 位佬友补充了宝贵经验，强调了代码健壮性、架构解耦以及高性价比部署策略。
3. **关键行动项**：读者可参考正文给出的配置指令，按需开启内核网络调优或拉取 Docker 镜像进行本地验证。`;

    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, aiSummary: summary } : t))
    );
    return summary;
  };

  // Filtered topics computation
  const filteredTopics = topics
    .filter((t) => {
      // Category filter
      if (selectedCategory !== 'all' && t.category.slug !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (selectedTag && !t.tags.includes(selectedTag)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchContent = t.content.toLowerCase().includes(q);
        const matchAuthor = t.author.name.toLowerCase().includes(q);
        const matchTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchAuthor && !matchTags) {
          return false;
        }
      }
      // Active tab filter
      if (activeTab === 'bookmarks') {
        return !!t.isBookmarked;
      }
      if (activeTab === 'featured') {
        return !!t.isFeatured;
      }
      return true;
    })
    .sort((a, b) => {
      // Pinned topics always on top for 'all' and 'latest'
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      if (activeTab === 'top') {
        return b.likes + b.views * 0.1 - (a.likes + a.views * 0.1);
      }
      if (activeTab === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      // Default: sort by lastActivityAt
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });

  const activeTopic = activeTopicId ? topics.find((t) => t.id === activeTopicId) || null : null;

  return (
    <ForumContext.Provider
      value={{
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        users,
        categories,
        topics,
        selectedCategory,
        setSelectedCategory,
        selectedTag,
        setSelectedTag,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        activeTopicId,
        setActiveTopicId,
        theme,
        toggleTheme,
        isComposerOpen,
        setIsComposerOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isUserSwitcherOpen,
        setIsUserSwitcherOpen,
        addTopic,
        addReply,
        toggleLikeTopic,
        toggleBookmarkTopic,
        toggleLikeReply,
        generateAiSummary,
        filteredTopics,
        activeTopic,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

export const useForum = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForum must be used within a ForumProvider');
  }
  return context;
};
