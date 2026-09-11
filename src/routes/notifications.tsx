import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AvatarOrb } from "@/components/ui/avatar-orb";
import { AppShell } from "@/components/shell/app-shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listNotifications, markNotificationsRead } from "@/lib/forum/queries";
import { formatRelative } from "@/lib/forum/time";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

const KIND: Record<string, string> = {
  like: "喜欢了你的帖子",
  reply: "回复了你",
  follow: "关注了你",
  repost: "转发了你的帖子",
};

function NotificationsPage() {
  const { user, isPending } = useCurrentUserState();
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!user) return;
    void markNotificationsRead().then(() => qc.invalidateQueries({ queryKey: ["unread"] }));
  }, [user, qc]);

  if (isPending) return <AppShell title="通知"><div className="h-40 skeleton" /></AppShell>;
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell title="通知">
      {(list.data ?? []).length === 0 && !list.isLoading ? (
        <p className="px-6 py-16 text-center text-muted">还没有通知。发帖、回帖之后，互动会出现在这里。</p>
      ) : null}
      <ul>
        {(list.data ?? []).map((n) => {
          const inner = (
            <div className="flex gap-3 px-4 py-3 hover:bg-fg/[0.03]">
              <AvatarOrb name={n.actor.displayName} hue={n.actor.avatarHue} size="sm" />
              <div className="min-w-0">
                <p className="text-[15px]">
                  <span className="font-semibold">{n.actor.displayName}</span>
                  <span className="text-muted"> {KIND[n.kind] ?? n.kind}</span>
                  <span className="text-subtle"> · {formatRelative(n.createdAt)}</span>
                </p>
                {n.preview ? <p className="mt-1 line-clamp-2 text-[14px] text-subtle">{n.preview}</p> : null}
              </div>
            </div>
          );
          return (
            <li key={n.id} className="border-b border-line">
              {n.postId ? (
                <Link to="/post/$id" params={{ id: n.postId }}>{inner}</Link>
              ) : (
                <Link to="/u/$handle" params={{ handle: n.actor.handle }}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
