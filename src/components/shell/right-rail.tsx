import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { AvatarOrb } from "@/components/ui/avatar-orb";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listCommunities, listTrends, toggleFollow, whoToFollow } from "@/lib/forum/queries";
import { formatCount } from "@/lib/forum/time";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ACCENT: Record<string, string> = {
  sky: "text-sky-400",
  emerald: "text-emerald-400",
  violet: "text-indigo-300",
  rose: "text-rose-400",
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export function RightRail() {
  const trends = useQuery({ queryKey: ["trends"], queryFn: () => listTrends() });
  const people = useQuery({ queryKey: ["who"], queryFn: () => whoToFollow() });
  const communities = useQuery({ queryKey: ["communities"], queryFn: () => listCommunities() });
  const { user } = useCurrentUserState();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <aside className="sticky top-0 hidden h-dvh w-[350px] shrink-0 flex-col gap-4 overflow-y-auto py-2 pl-6 pr-2 no-scrollbar lg:flex">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const value = q.trim();
          if (value) void navigate({ to: "/explore", search: { q: value } });
        }}
        className="glass sticky top-2 z-10 flex h-11 items-center gap-2 rounded-full px-4"
      >
        <Search className="size-4 text-subtle" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索 Orion"
          className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
        />
      </form>

      <section className="overflow-hidden rounded-[22px] border border-line bg-elevated/60">
        <h2 className="px-4 pt-3 text-[20px] font-bold tracking-tight">趋势</h2>
        <ul>
          {(trends.data ?? []).map((t) => (
            <li key={t.tag}>
              <Link
                to="/explore"
                search={{ q: `#${t.tag}` }}
                className="block px-4 py-3 hover:bg-fg/[0.04]"
              >
                <p className="text-[13px] text-subtle">社区热议</p>
                <p className="text-[15px] font-bold">#{t.tag}</p>
                <p className="text-[13px] text-subtle">{formatCount(t.count)} 帖</p>
              </Link>
            </li>
          ))}
          {trends.data?.length === 0 ? (
            <p className="px-4 py-3 text-sm text-subtle">还没有足够的话题</p>
          ) : null}
        </ul>
      </section>

      <section className="overflow-hidden rounded-[22px] border border-line bg-elevated/60">
        <h2 className="px-4 pt-3 text-[20px] font-bold tracking-tight">推荐关注</h2>
        <ul>
          {(people.data ?? []).map((p) => (
            <li key={p.userId} className="flex items-center gap-3 px-4 py-3">
              <Link to="/u/$handle" params={{ handle: p.handle }} className="flex min-w-0 flex-1 items-center gap-3">
                <AvatarOrb name={p.displayName} hue={p.avatarHue} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold leading-5">{p.displayName}</p>
                  <p className="truncate text-[13px] text-subtle">@{p.handle}</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  if (!user) {
                    void navigate({ to: "/login" });
                    return;
                  }
                  await toggleFollow({ data: p.userId });
                  await qc.invalidateQueries({ queryKey: ["who"] });
                }}
                className="press shrink-0 rounded-full bg-fg px-3 py-1.5 text-[13px] font-semibold text-bg"
              >
                关注
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-[22px] border border-line bg-elevated/60">
        <h2 className="px-4 pt-3 text-[20px] font-bold tracking-tight">社区</h2>
        <ul className="pb-2">
          {(communities.data ?? []).slice(0, 5).map((c) => (
            <li key={c.id}>
              <Link to="/c/$slug" params={{ slug: c.slug }} className="flex items-center gap-3 px-4 py-3 hover:bg-fg/[0.04]">
                <span className={`grid size-9 place-items-center rounded-2xl bg-fg/5 text-sm font-bold ${ACCENT[c.accent] ?? "text-accent"}`}>
                  {c.name.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold">{c.name}</p>
                  <p className="text-[13px] text-subtle">{formatCount(c.memberCount)} 成员</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
