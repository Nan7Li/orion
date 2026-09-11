import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { InlineComposer } from "@/components/post/composer";
import { PostCard } from "@/components/post/post-card";
import { AppShell } from "@/components/shell/app-shell";
import { getPost } from "@/lib/forum/queries";

export const Route = createFileRoute("/post/$id")({ component: PostPage });

function PostPage() {
  const { id } = Route.useParams();
  const data = useQuery({ queryKey: ["post", id], queryFn: () => getPost({ data: id }) });
  const post = data.data?.post;

  return (
    <AppShell
      title={
        <span className="flex items-center gap-2">
          <Link to="/" className="press rounded-full p-2 hover:bg-fg/10">
            <ArrowLeft className="size-5" />
          </Link>
          帖子
        </span>
      }
    >
      {data.data?.ancestors.map((p) => (
        <PostCard key={p.id} post={p} compact />
      ))}
      {post ? (
        <PostCard post={post} disableNav />
      ) : data.isLoading ? (
        <div className="h-40 skeleton" />
      ) : (
        <p className="px-4 py-10 text-center text-muted">帖子不存在或已删除。</p>
      )}
      {post ? <InlineComposer communityId={post.community?.id} parentId={post.id} /> : null}
      {(data.data?.replies ?? []).map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </AppShell>
  );
}
