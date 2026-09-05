export type TrustLevel = 0 | 1 | 2 | 3 | 4;

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  trustLevel: TrustLevel;
  trustTitle: string;
  bio?: string;
  joinedAt: string;
  likesReceived: number;
  topicsCount: number;
  badges?: string[];
  location?: string;
  website?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon?: string;
  topicsCount: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface Reply {
  id: string;
  topicId: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replyToReplyId?: string;
  replyToUser?: string;
  replyToContent?: string;
  floorNumber: number;
  reactions?: Reaction[];
}

export interface Topic {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  author: User;
  content: string;
  createdAt: string;
  lastActivityAt: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isPinned?: boolean;
  isFeatured?: boolean;
  isClosed?: boolean;
  repliesCount: number;
  participants: User[];
  replies: Reply[];
  aiSummary?: string;
  reactions?: Reaction[];
}

export type ViewTab = 'all' | 'latest' | 'top' | 'featured' | 'bookmarks' | 'unread';
export type DisplayMode = 'table' | 'card';
