'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, DisplayMode, Reply, Topic, User, ViewTab } from '@/types';
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
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTopicId: string | null;
  setActiveTopicId: (id: string | null) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isComposerOpen: boolean;
  setIsComposerOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isUserSwitcherOpen: boolean;
  setIsUserSwitcherOpen: (open: boolean) => void;
  addTopic: (title: string, categorySlug: string, tags: string[], content: string) => Topic;
  addReply: (topicId: string, content: string, replyToUser?: string, replyToContent?: string) => void;
  toggleLikeTopic: (topicId: string) => void;
  toggleBookmarkTopic: (topicId: string) => void;
  toggleLikeReply: (topicId: string, replyId: string) => void;
  toggleReactionTopic: (topicId: string, emoji: string) => void;
  toggleReactionReply: (topicId: string, replyId: string, emoji: string) => void;
  generateAiSummary: (topicId: string) => Promise<string>;
  filteredTopics: Topic[];
  activeTopic: Topic | null;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOPICS: 'orion_forum_topics_v3',
  CURRENT_USER: 'orion_forum_current_user_v3',
  THEME: 'orion_forum_theme_v3',
  DISPLAY_MODE: 'orion_forum_display_mode_v3',
  SIDEBAR_COLLAPSED: 'orion_forum_sidebar_v3',
};

export const ForumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [categories] = useState<Category[]>(CATEGORIES);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[5]); // Default: nan7li
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('all');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('table');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isComposerOpen, setIsComposerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState<boolean>(false);

  // Load state from localStorage
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

      const savedDisplayMode = localStorage.getItem(STORAGE_KEYS.DISPLAY_MODE) as DisplayMode | null;
      if (savedDisplayMode) {
        setDisplayMode(savedDisplayMode);
      }

      const savedSidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (savedSidebar !== null) {
        setIsSidebarCollapsed(savedSidebar === 'true');
      }
    } catch (e) {
      console.warn('Failed to load forum state', e);
    }
  }, []);

  // Update theme class
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

  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist user', e);
    }
  };

  const handleSetDisplayMode = (mode: DisplayMode) => {
    setDisplayMode(mode);
    localStorage.setItem(STORAGE_KEYS.DISPLAY_MODE, mode);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
      return next;
    });
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
      reactions: [],
    };

    setTopics((prev) => [newTopic, ...prev]);
    return newTopic;
  };

  const addReply = (topicId: string, content: string, replyToUser?: string, replyToContent?: string) => {
    const now = new Date().toISOString();
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const nextFloor = t.replies.length + 2;
          const newReply: Reply = {
            id: `reply-${Date.now()}`,
            topicId,
            floorNumber: nextFloor,
            author: currentUser,
            content,
            createdAt: now,
            likes: 0,
            isLiked: false,
            replyToUser,
            replyToContent,
            reactions: [],
          };
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
      prev.map((t) => (t.id === topicId ? { ...t, isBookmarked: !t.isBookmarked } : t))
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

  const toggleReactionTopic = (topicId: string, emoji: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const existing = t.reactions || [];
          const reactionIndex = existing.findIndex((r) => r.emoji === emoji);
          let updated: typeof existing;
          if (reactionIndex > -1) {
            const current = existing[reactionIndex];
            const hasUser = current.users.includes(currentUser.id);
            if (hasUser) {
              const newUsers = current.users.filter((id) => id !== currentUser.id);
              updated = existing.map((r, i) =>
                i === reactionIndex ? { ...r, count: Math.max(0, r.count - 1), users: newUsers } : r
              );
            } else {
              const newUsers = [...current.users, currentUser.id];
              updated = existing.map((r, i) =>
                i === reactionIndex ? { ...r, count: r.count + 1, users: newUsers } : r
              );
            }
          } else {
            updated = [...existing, { emoji, count: 1, users: [currentUser.id] }];
          }
          return { ...t, reactions: updated };
        }
        return t;
      })
    );
  };

  const toggleReactionReply = (topicId: string, replyId: string, emoji: string) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            replies: t.replies.map((r) => {
              if (r.id === replyId) {
                const existing = r.reactions || [];
                const reactionIndex = existing.findIndex((rx) => rx.emoji === emoji);
                let updated: typeof existing;
                if (reactionIndex > -1) {
                  const current = existing[reactionIndex];
                  const hasUser = current.users.includes(currentUser.id);
                  if (hasUser) {
                    const newUsers = current.users.filter((id) => id !== currentUser.id);
                    updated = existing.map((rx, i) =>
                      i === reactionIndex
                        ? { ...rx, count: Math.max(0, rx.count - 1), users: newUsers }
                        : rx
                    );
                  } else {
                    const newUsers = [...current.users, currentUser.id];
                    updated = existing.map((rx, i) =>
                      i === reactionIndex ? { ...rx, count: rx.count + 1, users: newUsers } : rx
                    );
                  }
                } else {
                  updated = [...existing, { emoji, count: 1, users: [currentUser.id] }];
                }
                return { ...r, reactions: updated };
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

    await new Promise((res) => setTimeout(res, 600));

    const summary = `【Orion AI 智能速读】
1. **议题背景**：围绕《${topic.title}》展开深度技术交流，楼主 @${topic.author.name} 分享了实践痛点与方案。
2. **社区共鸣**：已有 ${topic.replies.length} 位星友发表了专业见解，提炼出可靠性优先、注重网络与协议边界等关键经验。
3. **速览建议**：直接查看文中配置段落，可配合 Docker 与 Linux 内核优化脚本快速上手。`;

    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, aiSummary: summary } : t))
    );
    return summary;
  };

  const filteredTopics = topics
    .filter((t) => {
      if (selectedCategory !== 'all' && t.category.slug !== selectedCategory) {
        return false;
      }
      if (selectedTag && !t.tags.includes(selectedTag)) {
        return false;
      }
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
      if (activeTab === 'bookmarks') return !!t.isBookmarked;
      if (activeTab === 'featured') return !!t.isFeatured;
      if (activeTab === 'unread') return t.views < 5000;
      return true;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      if (activeTab === 'top') {
        return b.likes * 2 + b.views * 0.05 - (a.likes * 2 + a.views * 0.05);
      }
      if (activeTab === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
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
        displayMode,
        setDisplayMode: handleSetDisplayMode,
        isSidebarCollapsed,
        toggleSidebar,
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
        toggleReactionTopic,
        toggleReactionReply,
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
