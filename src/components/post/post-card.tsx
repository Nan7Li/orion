import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import { AvatarOrb } from "@/components/ui/avatar-orb";
import { useCompose } from "@/lib/forum/compose";
import { parseBody } from "@/lib/forum/text";
import { formatCount, formatRelative } from "@/lib/forum/time";
import type { Post } from "@/lib/forum/types";
import { cn } from "@/lib/utils";
import {
  toggleBookmark,
  toggleLike,
  toggleRepost,
} from "@/lib/forum/queries";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

const ACCENT: Record<string, string> = {
  sky: "text-sky-400",
  emerald: "text-emerald-400",
  violet: "text-indigo-300",
  rose: "text-rose-400",
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export function PostBody({ body, className }: { body: string; className?: string }) {
  return (
    <p className={cn("whitespace-pre-wrap break-words text-[15px] leading-relaxed text-fg", className)}>
      {parseBody(body).map((part, i) => {
        if (part.type === "tag") {
          return (
            <Link
              key={i}
              to="/explore"
              search={{ q: `#${part.value}` }}
              className="text-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              #{part.value}
            </Link>
          );
        }
        if (part.type === "mention") {
          return (
            <Link
              key={i}
              to="/u/$handle"
              params={{ handle: part.value }}
              className="text-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              @{part.value}
            </Link>
          );
        }
        return <span key={i}>{part.value}</span>;
      })}
    </p>
  );
}

export function PostCard({
  post,
  compact = false,
  disableNav = false,
}: {
  post: Post;
  compact?: boolean;
  disableNav?: boolean;
}) {
  const navigate = useNavigate();
  const compose = useCompose();
  const { user } = useCurrentUserState();
  const [local, setLocal] = useState(post);
  const [pop, setPop] = useState(false);

  async function needUser() {
    if (user) return true;
    void navigate({ to: "/login" });
    return false;
  }

  async function onLike(e: React.MouseEvent) {
    e.stopPropagation();
    if (!(await needUser())) return;
    const next = !local.liked;
    setLocal((p) => ({ ...p, liked: next, likeCount: p.likeCount + (next ? 1 : -1) }));
    if (next) {
      setPop(true);
      window.setTimeout(() => setPop(false), 420);
    }
    try {
      await toggleLike({ data: post.id });
    } catch {
      setLocal(post);
    }
  }

  async function onRepost(e: React.MouseEvent) {
    e.stopPropagation();
    if (!(await needUser())) return;
    const next = !local.reposted;
    setLocal((p) => ({ ...p, reposted: next, repostCount: p.repostCount + (next ? 1 : -1) }));
    try {
      await toggleRepost({ data: post.id });
    } catch {
      setLocal(post);
    }
  }

  async function onBookmark(e: React.MouseEvent) {
    e.stopPropagation();
    if (!(await needUser())) return;
    const next = !local.bookmarked;
    setLocal((p) => ({ ...p, bookmarked: next }));
    try {
      await toggleBookmark({ data: post.id });
    } catch {
      setLocal(post);
    }
  }

  function openPost() {
    if (disableNav) return;
    void navigate({ to: "/post/$id", params: { id: post.id } });
  }

  return (
    <article
      role={disableNav ? undefined : "link"}
      tabIndex={disableNav ? undefined : 0}
      onClick={openPost}
      onKeyDown={(e) => {
        if (e.key === "Enter") openPost();
      }}
      className={cn(
        "group relative border-b border-line/80 px-4 py-3 transition-colors duration-150",
        !disableNav && "hover:bg-fg/[0.03] cursor-pointer",
        compact && "py-2.5",
      )}
    >
      <div className="flex gap-3">
        <Link
          to="/u/$handle"
          params={{ handle: local.author.handle }}
          onClick={(e) => e.stopPropagation()}
          className="mt-0.5 shrink-0"
        >
          <AvatarOrb name={local.author.displayName} hue={local.author.avatarHue} size={compact ? "sm" : "md"} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 text-[15px] leading-5">
            <Link
              to="/u/$handle"
              params={{ handle: local.author.handle }}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-0.5 font-semibold text-fg hover:underline"
            >
              {local.author.displayName}
              {local.author.verified ? (
                <BadgeCheck className="size-4 fill-accent text-bg" strokeWidth={1.75} />
              ) : null}
            </Link>
            <span className="text-subtle">@{local.author.handle}</span>
            <span className="text-subtle">·</span>
            <time className="text-subtle" dateTime={local.createdAt}>
              {formatRelative(local.createdAt)}
            </time>
            {local.community ? (
              <>
                <span className="text-subtle">·</span>
                <Link
                  to="/c/$slug"
                  params={{ slug: local.community.slug }}
                  onClick={(e) => e.stopPropagation()}
                  className={cn("text-[13px] font-medium hover:underline", ACCENT[local.community.accent])}
                >
                  {local.community.name}
                </Link>
              </>
            ) : null}
            {local.isPinned ? (
              <span className="ml-1 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                置顶
              </span>
            ) : null}
          </div>
          <PostBody body={local.body} className="mt-1" />
          {local.quote ? (
            <Link
              to="/post/$id"
              params={{ id: local.quote.id }}
              onClick={(e) => e.stopPropagation()}
              className="mt-2 block rounded-[20px] border border-line p-3 hover:bg-fg/[0.03]"
            >
              <div className="flex items-center gap-2 text-[13px] text-muted">
                <AvatarOrb name={local.quote.displayName} hue={local.quote.avatarHue} size="xs" />
                <span className="font-medium text-fg">{local.quote.displayName}</span>
                <span>@{local.quote.handle}</span>
              </div>
              <p className="mt-1 line-clamp-4 text-[14px] leading-relaxed text-fg/90">{local.quote.body}</p>
            </Link>
          ) : null}
          <div className="mt-2 -ml-2 flex max-w-md items-center justify-between text-subtle">
            <Action
              label="回复"
              onClick={(e) => {
                e.stopPropagation();
                if (!user) {
                  void navigate({ to: "/login" });
                  return;
                }
                compose.openCompose({
                  parentId: local.id,
                  communityId: local.community?.id ?? null,
                  replyTo: { handle: local.author.handle, body: local.body },
                });
              }}
            >
              <MessageCircle className="size-[18px]" strokeWidth={1.75} />
              {local.replyCount > 0 ? formatCount(local.replyCount) : null}
            </Action>
            <Action
              label="转发"
              active={local.reposted}
              activeClass="text-repost"
              onClick={onRepost}
            >
              <Repeat2 className="size-[18px]" strokeWidth={1.75} />
              {local.repostCount > 0 ? formatCount(local.repostCount) : null}
            </Action>
            <Action
              label="喜欢"
              active={local.liked}
              activeClass="text-like"
              onClick={onLike}
            >
              <Heart
                className={cn("size-[18px]", pop && "heart-pop", local.liked && "fill-like")}
                strokeWidth={1.75}
              />
              {local.likeCount > 0 ? formatCount(local.likeCount) : null}
            </Action>
            <Action label="书签" active={local.bookmarked} onClick={onBookmark}>
              <Bookmark
                className={cn("size-[18px]", local.bookmarked && "fill-accent text-accent")}
                strokeWidth={1.75}
              />
            </Action>
            <Action
              label="分享"
              onClick={async (e) => {
                e.stopPropagation();
                const url = `${window.location.origin}/post/${local.id}`;
                try {
                  await navigator.clipboard.writeText(url);
                } catch {
                  /* ignore */
                }
              }}
            >
              <Share className="size-[18px]" strokeWidth={1.75} />
            </Action>
          </div>
        </div>
      </div>
    </article>
  );
}

function Action({
  children,
  onClick,
  active,
  activeClass,
  label,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  activeClass?: string;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "press flex min-h-11 min-w-11 items-center gap-1.5 rounded-full px-2 text-[13px] tabular-nums",
        "hover:bg-fg/[0.06] hover:text-fg",
        active && (activeClass ?? "text-accent"),
      )}
    >
      {children}
    </button>
  );
}
