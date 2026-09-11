export type CommunityAccent =
  | "sky"
  | "emerald"
  | "violet"
  | "rose"
  | "cyan"
  | "amber"
  | "red";

export type FeedTab = "for-you" | "following";

export type Author = {
  userId: string;
  handle: string;
  displayName: string;
  bio: string;
  avatarHue: number;
  location: string;
  website: string;
  verified: boolean;
  createdAt: string;
  followers: number;
  following: number;
  posts: number;
  isFollowing: boolean;
};

export type Community = {
  id: string;
  slug: string;
  name: string;
  description: string;
  rules: string;
  accent: CommunityAccent;
  memberCount: number;
  joined: boolean;
};

export type Post = {
  id: string;
  body: string;
  createdAt: string;
  parentId: string | null;
  quoteId: string | null;
  isPinned: boolean;
  likeCount: number;
  repostCount: number;
  replyCount: number;
  bookmarkCount: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
  author: {
    userId: string;
    handle: string;
    displayName: string;
    avatarHue: number;
    verified: boolean;
  };
  community: {
    id: string;
    slug: string;
    name: string;
    accent: CommunityAccent;
  } | null;
  quote: {
    id: string;
    body: string;
    handle: string;
    displayName: string;
    avatarHue: number;
  } | null;
};

export type Notification = {
  id: string;
  kind: "like" | "reply" | "follow" | "repost";
  createdAt: string;
  read: boolean;
  actor: {
    userId: string;
    handle: string;
    displayName: string;
    avatarHue: number;
  };
  postId: string | null;
  preview: string | null;
};

export type Trend = {
  tag: string;
  count: number;
};
