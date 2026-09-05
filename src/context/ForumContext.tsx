'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Category, DisplayMode, Reply, Topic, User, ViewTab } from '@/types';
import { CATEGORIES, INITIAL_TOPICS, INITIAL_USERS } from '@/data/initialData';

export interface ToastItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ForumNotification {
  id: string;
  type: 'reply' | 'like' | 'level_up' | 'badge' | 'mention';
  title: string;
  content: string;
  topicId?: string;
  createdAt: string;
  isRead: boolean;
}

interface ForumContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean, tab?: 'login' | 'register') => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, name: string, password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isChatDrawerOpen: boolean;
  setIsChatDrawerOpen: (open: boolean) => void;
  isLevelMatrixOpen: boolean;
  setIsLevelMatrixOpen: (open: boolean) => void;
  viewingUser: User | null;
  setViewingUser: (user: User | null) => void;
  notifications: ForumNotification[];
  markAllNotificationsRead: () => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  addTopic: (title: string, categorySlug: string, tags: string[], content: string) => Topic;
  addReply: (topicId: string, content: string, replyToUser?: string, replyToContent?: string) => Promise<void>;
  toggleLikeTopic: (topicId: string) => Promise<void>;
  toggleBookmarkTopic: (topicId: string) => Promise<void>;
  toggleLikeReply: (topicId: string, replyId: string) => Promise<void>;
  toggleReactionTopic: (topicId: string, emoji: string) => Promise<void>;
  toggleReactionReply: (topicId: string, replyId: string, emoji: string) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refreshTopics: () => Promise<void>;
  generateAiSummary: (topicId: string) => Promise<string>;
  filteredTopics: Topic[];
  activeTopic: Topic | null;
  isLoading: boolean;
}

const ForumContext = createContext<ForumContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOPICS: 'orion_forum_topics_v4',
  CURRENT_USER: 'orion_forum_current_user_v4',
  AUTH_TOKEN: 'orion_auth_token_v4',
  THEME: 'orion_forum_theme_v4',
  DISPLAY_MODE: 'orion_forum_display_mode_v4',
  SIDEBAR_COLLAPSED: 'orion_forum_sidebar_v4',
  NOTIFICATIONS: 'orion_forum_notifications_v4',
};

const INITIAL_NOTIFICATIONS: ForumNotification[] = [
  {
    id: 'notif-1',
    type: 'level_up',
    title: '宇宙星阶晋升提醒',
    content: '祝贺跃迁！你的星际引力值已达到 Lv.3【恒星守望者】，已解锁标签共治与精选推荐权。',
    createdAt: '2024-09-05T18:00:00Z',
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'reply',
    title: 'Neo 回复了你的评论',
    content: '“已为前排回帖的两位星友下发 Token，请进入个人控制台查收！”',
    topicId: 'topic-4',
    createdAt: '2024-09-04T14:00:00Z',
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'like',
    title: 'Cygnus_极客 点赞了你的发言',
    content: '在话题《各大云厂商海外 VPS 线路全面实测》中获得了 1 次星际赞赏。',
    topicId: 'topic-3',
    createdAt: '2024-09-03T16:45:00Z',
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'badge',
    title: '获得星舰通标勋章',
    content: '你已荣获【🌟 恒星守望者】与【🚀 探索先锋】勋章，已点亮星际通行证。',
    createdAt: '2024-09-01T10:00:00Z',
    isRead: true,
  },
];

export const ForumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[5]); // Default logged in as Nan7Li
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState<boolean>(false);
  const [isLevelMatrixOpen, setIsLevelMatrixOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpenState] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<ForumNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const setIsAuthModalOpen = useCallback((open: boolean, tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpenState(open);
  }, []);

  // Fetch topics from Cloudflare D1
  const fetchD1Topics = useCallback(async (userId?: string) => {
    try {
      setIsLoading(true);
      const uid = userId || (currentUser ? currentUser.id : 'guest');
      const res = await fetch(`/api/topics?userId=${encodeURIComponent(uid)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.topics) && data.topics.length > 0) {
          setTopics(data.topics);
          try {
            localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(data.topics));
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Live D1 topics fetch error, keeping cached state:', e);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Fetch users from Cloudflare D1
  const fetchD1Users = useCallback(async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
          if (currentUser) {
            const found = data.users.find((u: User) => u.id === currentUser.id);
            if (found) {
              setCurrentUser(found);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Live D1 users fetch error:', e);
    }
  }, [currentUser]);

  // Fetch categories from Cloudflare D1
  const fetchD1Categories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch {}
  }, []);

  // Initial load & Session Restoration
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.id) setCurrentUser(parsed);
      }

      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light' | null;
      if (savedTheme) setTheme(savedTheme);

      const savedDisplayMode = localStorage.getItem(STORAGE_KEYS.DISPLAY_MODE) as DisplayMode | null;
      if (savedDisplayMode) setDisplayMode(savedDisplayMode);

      const savedSidebar = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (savedSidebar !== null) setIsSidebarCollapsed(savedSidebar === 'true');

      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed) && parsed.length > 0) setNotifications(parsed);
      }

      // Check URL query for direct topic link e.g. ?t=topic-1
      const params = new URLSearchParams(window.location.search);
      const urlTopicId = params.get('t');
      if (urlTopicId) {
        setActiveTopicId(urlTopicId);
      }
    } catch (e) {
      console.warn('Failed to load local state', e);
    }

    fetchD1Topics();
    fetchD1Users();
    fetchD1Categories();

    // Check token with /api/auth/me
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.user) {
            setCurrentUser(d.user);
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(d.user));
          }
        })
        .catch(() => {});
    }
  }, [fetchD1Topics, fetchD1Users, fetchD1Categories]);

  // Sync URL with active topic
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activeTopicId) {
        url.searchParams.set('t', activeTopicId);
      } else {
        url.searchParams.delete('t');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, [activeTopicId]);

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

  // Auth: Login
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUser(data.user);
        try {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
          if (data.token) localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        } catch {}
        showToast(data.message || `🌌 欢迎登入，${data.user.name}！`, 'success');
        fetchD1Topics(data.user.id);
        return { success: true };
      } else {
        return { success: false, error: data.error || '登入失败' };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '网络连接失败';
      return { success: false, error: msg };
    }
  };

  // Auth: Register
  const register = async (
    username: string,
    name: string,
    password: string,
    email?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, password, email }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setCurrentUser(data.user);
        setUsers((prev) => [data.user, ...prev]);
        try {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
          if (data.token) localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
        } catch {}
        showToast(data.message || `🚀 跃迁成功！欢迎加入猎户座星系，${data.user.name}！`, 'success');
        fetchD1Topics(data.user.id);
        return { success: true };
      } else {
        return { success: false, error: data.error || '注册失败' };
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '网络连接失败';
      return { success: false, error: msg };
    }
  };

  // Auth: Logout
  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {}
    showToast('🛰️ 已安全断开星际通行证连接，转入星尘观测者浏览模式', 'info');
    fetchD1Topics('guest');
  };

  // User switcher
  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        showToast(`🌌 已切换星舰身份：${user.name} (${user.trustTitle})`, 'info');
        fetchD1Topics(user.id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        showToast(`已切换为游客模式`, 'info');
        fetchD1Topics('guest');
      }
    } catch {}
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

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      try {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    showToast('✨ 所有星际通知已标为已读', 'success');
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

  // Real Add Topic to D1
  const addTopic = (
    title: string,
    categorySlug: string,
    tags: string[],
    content: string
  ): Topic => {
    if (!currentUser) {
      showToast('🪐 请先登入星际通行证以发布星轨议题', 'warning');
      setIsAuthModalOpen(true, 'login');
      return {} as Topic;
    }

    const cat = categories.find((c) => c.slug === categorySlug) || categories[1];
    const now = new Date().toISOString();
    const tempId = `topic-${Date.now()}`;

    const newTopic: Topic = {
      id: tempId,
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

    // Optimistic UI
    setTopics((prev) => [newTopic, ...prev]);
    showToast('🚀 话题发布成功！正在同步至 Cloudflare D1 星际数据库...', 'success');

    fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        categorySlug,
        tags,
        content,
        authorId: currentUser.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.topic) {
          setTopics((prev) => prev.map((t) => (t.id === tempId ? data.topic : t)));
          showToast('✅ 猎户座 D1 全网节点同步完成！全终端可实时访问', 'success');
        }
      })
      .catch((err) => {
        console.warn('Backend sync failed, saved locally:', err);
      });

    return newTopic;
  };

  // Real Add Reply to D1
  const addReply = async (
    topicId: string,
    content: string,
    replyToUser?: string,
    replyToContent?: string
  ) => {
    if (!currentUser) {
      showToast('🪐 请先登入星际通行证以发表回帖', 'warning');
      setIsAuthModalOpen(true, 'login');
      return;
    }

    const now = new Date().toISOString();
    const tempReplyId = `reply-${Date.now()}`;

    // Optimistic update
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const nextFloor = t.replies.length + 2;
          const newReply: Reply = {
            id: tempReplyId,
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
    showToast('💬 回复已发表，正在入轨 Cloudflare D1...', 'success');

    try {
      const res = await fetch(`/api/topics/${topicId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          authorId: currentUser.id,
          replyToUser,
          replyToContent,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reply) {
          setTopics((prev) =>
            prev.map((t) => {
              if (t.id === topicId) {
                return {
                  ...t,
                  replies: t.replies.map((r) => (r.id === tempReplyId ? data.reply : r)),
                };
              }
              return t;
            })
          );
          showToast('✅ 回复已持久化至星云节点', 'success');
        }
      }
    } catch (e) {
      console.warn('Reply D1 sync error:', e);
    }
  };

  // Real Toggle Like Topic
  const toggleLikeTopic = async (topicId: string) => {
    if (!currentUser) {
      showToast('🪐 请先登入星际通行证以点赞', 'warning');
      setIsAuthModalOpen(true, 'login');
      return;
    }

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

    try {
      const res = await fetch(`/api/topics/${topicId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTopics((prev) =>
            prev.map((t) => (t.id === topicId ? { ...t, isLiked: data.isLiked, likes: data.likes } : t))
          );
        }
      }
    } catch (e) {
      console.warn('Topic like error:', e);
    }
  };

  // Real Toggle Bookmark
  const toggleBookmarkTopic = async (topicId: string) => {
    if (!currentUser) {
      showToast('🪐 请先登入以使用书签收藏', 'warning');
      setIsAuthModalOpen(true, 'login');
      return;
    }

    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, isBookmarked: !t.isBookmarked } : t))
    );

    try {
      const res = await fetch(`/api/topics/${topicId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          showToast(data.isBookmarked ? '⭐ 话题已加入星标书签' : '已取消书签收藏', 'info');
        }
      }
    } catch (e) {
      console.warn('Bookmark error:', e);
    }
  };

  // Real Toggle Like Reply
  const toggleLikeReply = async (topicId: string, replyId: string) => {
    if (!currentUser) {
      showToast('🪐 请先登入以点赞回复', 'warning');
      setIsAuthModalOpen(true, 'login');
      return;
    }

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

    try {
      await fetch(`/api/replies/${replyId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
    } catch (e) {
      console.warn('Reply like error:', e);
    }
  };

  // Real Toggle Reaction Topic
  const toggleReactionTopic = async (topicId: string, emoji: string) => {
    if (!currentUser) {
      showToast('🪐 请先登入以添加表情交互', 'warning');
      setIsAuthModalOpen(true, 'login');
      return;
    }

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          const existing = t.reactions || [];
          const rxIdx = existing.findIndex((r) => r.emoji === emoji);
          let updated: typeof existing;
          if (rxIdx > -1) {
            const current = existing[rxIdx];
            const hasUser = current.users.includes(currentUser.id);
            if (hasUser) {
              const newUsers = current.users.filter((id) => id !== currentUser.id);
              updated = existing.map((r, i) =>
                i === rxIdx ? { ...r, count: Math.max(0, r.count - 1), users: newUsers } : r
              );
            } else {
              const newUsers = [...current.users, currentUser.id];
              updated = existing.map((r, i) =>
                i === rxIdx ? { ...r, count: r.count + 1, users: newUsers } : r
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

    try {
      const res = await fetch(`/api/topics/${topicId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, userId: currentUser.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reactions) {
          setTopics((prev) =>
            prev.map((t) => (t.id === topicId ? { ...t, reactions: data.reactions } : t))
          );
        }
      }
    } catch (e) {
      console.warn('Topic reaction error:', e);
    }
  };

  // Real Toggle Reaction Reply
  const toggleReactionReply = async (topicId: string, replyId: string, emoji: string) => {
    if (!currentUser) {
      showToast('🪐 请先登入以添加表情交互', 'warning');
      setIsAuthModalOpen(true, 'login');
      return;
    }

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            replies: t.replies.map((r) => {
              if (r.id === replyId) {
                const existing = r.reactions || [];
                const rxIdx = existing.findIndex((rx) => rx.emoji === emoji);
                let updated: typeof existing;
                if (rxIdx > -1) {
                  const current = existing[rxIdx];
                  const hasUser = current.users.includes(currentUser.id);
                  if (hasUser) {
                    const newUsers = current.users.filter((id) => id !== currentUser.id);
                    updated = existing.map((rx, i) =>
                      i === rxIdx ? { ...rx, count: Math.max(0, rx.count - 1), users: newUsers } : rx
                    );
                  } else {
                    const newUsers = [...current.users, currentUser.id];
                    updated = existing.map((rx, i) =>
                      i === rxIdx ? { ...rx, count: rx.count + 1, users: newUsers } : rx
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

    try {
      const res = await fetch(`/api/replies/${replyId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, userId: currentUser.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.reactions) {
          setTopics((prev) =>
            prev.map((t) => {
              if (t.id === topicId) {
                return {
                  ...t,
                  replies: t.replies.map((r) => (r.id === replyId ? { ...r, reactions: data.reactions } : r)),
                };
              }
              return t;
            })
          );
        }
      }
    } catch (e) {
      console.warn('Reply reaction error:', e);
    }
  };

  // Update user profile in D1
  const updateUserProfile = async (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    } catch {}

    showToast('🪐 星际通行证档案更新中...', 'info');

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          name: updates.name,
          avatar: updates.avatar,
          bio: updates.bio,
          location: updates.location,
          website: updates.website,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser(data.user);
          showToast('✅ 档案已成功同步至猎户座星网！', 'success');
        }
      }
    } catch {
      showToast('⚠️ 档案已本地保存，将在下次重试同步', 'warning');
    }
  };

  const refreshTopics = async () => {
    showToast('🔄 正在同步全星域最新轨道数据...', 'info');
    await fetchD1Topics();
    showToast('✨ 星河动态已刷新至最新引力波！', 'success');
  };

  const generateAiSummary = async (topicId: string): Promise<string> => {
    const topic = topics.find((t) => t.id === topicId);
    if (!topic) return '';
    if (topic.aiSummary) return topic.aiSummary;

    await new Promise((res) => setTimeout(res, 500));

    const summary = `【Orion 猎户座 AI 智能速读】
1. **议题背景**：围绕《${topic.title}》展开深度技术交流，楼主 @${topic.author.name} 提出了关键思考与落地实践方案。
2. **社区共鸣**：已有 ${topic.replies.length} 位星友发表了专业见解，提炼出可靠性优先、注重网络与协议边界等关键经验。
3. **速览建议**：直接查看文中配置段落，配合社区推荐参数即可快速验证调优。`;

    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, aiSummary: summary } : t))
    );

    // Save summary to D1
    try {
      fetch(`/api/topics/${topicId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiSummary: summary }),
      });
    } catch {}

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
        isLoggedIn: !!currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        login,
        register,
        logout,
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
        isNotificationsOpen,
        setIsNotificationsOpen,
        isChatDrawerOpen,
        setIsChatDrawerOpen,
        isLevelMatrixOpen,
        setIsLevelMatrixOpen,
        viewingUser,
        setViewingUser,
        notifications,
        markAllNotificationsRead,
        toasts,
        showToast,
        removeToast,
        addTopic,
        addReply,
        toggleLikeTopic,
        toggleBookmarkTopic,
        toggleLikeReply,
        toggleReactionTopic,
        toggleReactionReply,
        updateUserProfile,
        refreshTopics,
        generateAiSummary,
        filteredTopics,
        activeTopic,
        isLoading,
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
