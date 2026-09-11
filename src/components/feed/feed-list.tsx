import { PostCard } from "@/components/post/post-card";
import type { Post } from "@/lib/forum/types";

export function FeedList({
  posts,
  empty,
  error,
}: {
  posts: Post[] | undefined;
  empty: string;
  error?: Error | null;
}) {
  if (error) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-[17px] font-semibold">时间线暂时不可用</p>
        <p className="mt-1 text-sm text-muted">{error.message}</p>
      </div>
    );
  }
  if (!posts) {
    return (
      <div className="space-y-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 border-b border-line px-4 py-4">
            <div className="size-10 rounded-full skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded skeleton" />
              <div className="h-16 w-full rounded-lg skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (posts.length === 0) {
    return (
      <div className="px-8 py-16 text-center">
        <p className="text-[17px] font-semibold">还没有帖子</p>
        <p className="mt-1 text-sm text-muted">{empty}</p>
      </div>
    );
  }
  return (
    <div>
      {posts.map((p) => (
        <div key={p.id} className="feed-enter">
          <PostCard post={p} />
        </div>
      ))}
    </div>
  );
}
