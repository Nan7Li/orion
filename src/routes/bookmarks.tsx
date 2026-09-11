import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FeedList } from "@/components/feed/feed-list";
import { AppShell } from "@/components/shell/app-shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listBookmarks } from "@/lib/forum/queries";

export const Route = createFileRoute("/bookmarks")({ component: BookmarksPage });

function BookmarksPage() {
  const { user, isPending } = useCurrentUserState();
  const list = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => listBookmarks(),
    enabled: Boolean(user),
  });
  if (isPending) return <AppShell title="书签"><div className="h-40 skeleton" /></AppShell>;
  if (!user) return <RedirectToSignIn />;
  return (
    <AppShell title="书签">
      <FeedList posts={list.data} empty="把以后还想读的帖子收在这里。" />
    </AppShell>
  );
}
