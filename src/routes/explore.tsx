import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { FeedList } from "@/components/feed/feed-list";
import { AppShell } from "@/components/shell/app-shell";
import { listCommunities, listFeed, listTrends } from "@/lib/forum/queries";
import { formatCount } from "@/lib/forum/time";

export const Route = createFileRoute("/explore")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: Explore,
});

function Explore() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q ?? "");
  const feed = useQuery({
    queryKey: ["search", q ?? ""],
    queryFn: () => listFeed({ data: { q: q || undefined } }),
  });
  const trends = useQuery({ queryKey: ["trends"], queryFn: () => listTrends() });
  const communities = useQuery({ queryKey: ["communities"], queryFn: () => listCommunities() });

  return (
    <AppShell title="探索">
      <form
        className="border-b border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const next = value.trim();
          void navigate({ to: "/explore", search: { q: next || undefined } });
        }}
      >
        <label className="glass flex h-11 items-center gap-2 rounded-full px-4">
          <Search className="size-4 text-subtle" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="搜索帖子、呼号、话题"
            className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
          />
        </label>
      </form>
      {q ? (
        <FeedList posts={feed.data} empty={`没有与「${q}」相关的结果`} />
      ) : (
        <div className="px-4 py-4">
          <h2 className="text-[20px] font-bold tracking-tight">今天的社区</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(communities.data ?? []).map((c) => (
              <Link
                key={c.id}
                to="/c/$slug"
                params={{ slug: c.slug }}
                className="press rounded-[20px] border border-line bg-elevated/50 p-3"
              >
                <p className="font-semibold">{c.name}</p>
                <p className="mt-1 line-clamp-2 text-[13px] text-muted">{c.description}</p>
                <p className="mt-2 text-[12px] text-subtle">{formatCount(c.memberCount)} 成员</p>
              </Link>
            ))}
          </div>
          <h2 className="mt-8 text-[20px] font-bold tracking-tight">趋势</h2>
          <ul className="mt-2">
            {(trends.data ?? []).map((t) => (
              <li key={t.tag}>
                <Link
                  to="/explore"
                  search={{ q: `#${t.tag}` }}
                  className="flex items-center justify-between rounded-[16px] px-2 py-3 hover:bg-fg/[0.04]"
                >
                  <div>
                    <p className="text-[13px] text-subtle">热议话题</p>
                    <p className="text-[16px] font-bold">#{t.tag}</p>
                  </div>
                  <span className="text-[13px] text-subtle">{formatCount(t.count)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AppShell>
  );
}
