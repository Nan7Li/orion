import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FeedList } from "@/components/feed/feed-list";
import { InlineComposer } from "@/components/post/composer";
import { AppShell } from "@/components/shell/app-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listFeed } from "@/lib/forum/queries";
import type { FeedTab } from "@/lib/forum/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: () => listFeed({ data: { tab: "for-you" } }),
  component: Home,
});

function Home() {
  const initial = Route.useLoaderData();
  const [tab, setTab] = useState<FeedTab>("for-you");
  const { user } = useCurrentUserState();
  const feed = useQuery({
    queryKey: ["feed", tab],
    queryFn: () => listFeed({ data: { tab } }),
    initialData: tab === "for-you" ? initial : undefined,
  });

  return (
    <AppShell>
      <header className="glass-thin sticky top-0 z-20 border-b border-line">
        <div className="flex h-14 items-center px-4">
          <h1 className="text-[17px] font-bold tracking-tight">首页</h1>
        </div>
        <div className="relative grid grid-cols-2">
          <TabButton active={tab === "for-you"} onClick={() => setTab("for-you")}>
            为你推荐
          </TabButton>
          <TabButton
            active={tab === "following"}
            onClick={() => setTab("following")}
            disabled={!user}
          >
            正在关注
          </TabButton>
          <span
            className="absolute bottom-0 h-0.5 w-1/2 rounded-full bg-accent transition-transform duration-200"
            style={{ transform: tab === "following" ? "translateX(100%)" : "translateX(0)" }}
          />
        </div>
      </header>
      <InlineComposer />
      <FeedList
        posts={feed.data}
        error={feed.error}
        empty={tab === "following" ? "关注一些人，或加入社区，这里就会亮起来。" : "成为第一个发帖的人。"}
      />
    </AppShell>
  );
}

function TabButton({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-12 text-[15px] transition-colors duration-150 disabled:opacity-40",
        active ? "font-semibold text-fg" : "font-medium text-subtle hover:bg-fg/[0.04]",
      )}
    >
      {children}
    </button>
  );
}
