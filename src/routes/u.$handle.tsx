import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Link2, MapPin } from "lucide-react";
import { useState } from "react";
import { AvatarOrb } from "@/components/ui/avatar-orb";
import { FeedList } from "@/components/feed/feed-list";
import { AppShell } from "@/components/shell/app-shell";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile, getProfile, listRepliesForUser, listUserPosts, toggleFollow } from "@/lib/forum/queries";
import { formatCount } from "@/lib/forum/time";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/u/$handle")({ component: ProfilePage });

type Tab = "posts" | "replies" | "likes";

function ProfilePage() {
  const { handle } = Route.useParams();
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("posts");
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const profile = useQuery({ queryKey: ["profile", handle], queryFn: () => getProfile({ data: handle }) });
  const posts = useQuery({
    queryKey: ["user-posts", handle, tab],
    queryFn: () =>
      tab === "replies"
        ? listRepliesForUser({ data: handle })
        : listUserPosts({ data: { handle, kind: tab === "likes" ? "likes" : "posts" } }),
  });
  const follow = useMutation({
    mutationFn: (id: string) => toggleFollow({ data: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", handle] }),
  });
  const p = profile.data;
  const mine = Boolean(me.data && p && me.data.userId === p.userId);

  return (
    <AppShell
      title={
        <span className="flex items-center gap-2">
          <Link to="/" className="press rounded-full p-2 hover:bg-fg/10">
            <ArrowLeft className="size-5" />
          </Link>
          {p?.displayName ?? handle}
        </span>
      }
      headerRight={mine ? <UserButton /> : null}
    >
      {p ? (
        <section className="border-b border-line px-4 pb-4">
          <div className="h-24 rounded-b-[24px] bg-[radial-gradient(circle_at_20%_0%,color-mix(in_oklab,var(--color-accent)_28%,transparent),transparent_55%)]" />
          <div className="-mt-10 flex items-end justify-between">
            <AvatarOrb name={p.displayName} hue={p.avatarHue} size="xl" className="ring-4 ring-bg" />
            {mine ? (
              <span className="mb-1 rounded-full border border-line px-4 py-1.5 text-[13px] font-semibold">你的主页</span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    void navigate({ to: "/login" });
                    return;
                  }
                  follow.mutate(p.userId);
                }}
                className={cn(
                  "press mb-1 rounded-full px-4 py-1.5 text-[13px] font-semibold",
                  p.isFollowing ? "border border-line" : "bg-fg text-bg",
                )}
              >
                {p.isFollowing ? "正在关注" : "关注"}
              </button>
            )}
          </div>
          <h1 className="mt-3 text-[20px] font-bold tracking-tight">{p.displayName}</h1>
          <p className="text-[15px] text-subtle">@{p.handle}</p>
          {p.bio ? <p className="mt-2 text-[15px] leading-relaxed">{p.bio}</p> : null}
          <div className="mt-2 flex flex-wrap gap-3 text-[13px] text-subtle">
            {p.location ? (
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {p.location}
              </span>
            ) : null}
            {p.website ? (
              <a href={p.website} className="flex items-center gap-1 text-accent" target="_blank" rel="noreferrer">
                <Link2 className="size-3.5" /> {p.website.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </div>
          <p className="mt-3 text-[14px]">
            <span className="font-bold">{formatCount(p.following)}</span>
            <span className="ml-1 text-subtle">正在关注</span>
            <span className="ml-4 font-bold">{formatCount(p.followers)}</span>
            <span className="ml-1 text-subtle">关注者</span>
          </p>
        </section>
      ) : profile.isLoading ? (
        <div className="h-48 skeleton" />
      ) : (
        <p className="px-4 py-10 text-center text-muted">找不到这个人。</p>
      )}
      <div className="relative grid grid-cols-3 border-b border-line">
        {(["posts", "replies", "likes"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn("h-12 text-[15px]", tab === key ? "font-semibold" : "text-subtle")}
          >
            {key === "posts" ? "帖子" : key === "replies" ? "回复" : "喜欢"}
          </button>
        ))}
      </div>
      <FeedList
        posts={posts.data}
        empty={tab === "likes" ? "还没有喜欢过帖子。" : tab === "replies" ? "还没有回复。" : "还没有发帖。"}
      />
    </AppShell>
  );
}
