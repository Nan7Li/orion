import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  House,
  PenSquare,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useCompose } from "@/lib/forum/compose";
import { getMyProfile, unreadCount } from "@/lib/forum/queries";
import { useQuery } from "@tanstack/react-query";
import { AvatarOrb } from "@/components/ui/avatar-orb";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export function OrionMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <defs>
        <linearGradient id="om" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9ecfff" />
          <stop offset="1" stopColor="#1d9bf0" />
        </linearGradient>
      </defs>
      <circle cx="6" cy="20" r="2.2" fill="url(#om)" />
      <circle cx="16" cy="12" r="2.6" fill="url(#om)" />
      <circle cx="26" cy="18" r="2.2" fill="url(#om)" />
      <path
        d="M6 20 L16 12 L26 18"
        fill="none"
        stroke="url(#om)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SideNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const mounted = useMounted();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const unread = useQuery({ queryKey: ["unread"], queryFn: () => unreadCount() });
  const compose = useCompose();

  const items = [
    { to: "/", icon: House, label: "首页", match: (p: string) => p === "/" },
    { to: "/explore", icon: Search, label: "探索", match: (p: string) => p.startsWith("/explore") },
    { to: "/communities", icon: Users, label: "社区", match: (p: string) => p.startsWith("/c") || p.startsWith("/communities") },
    { to: "/notifications", icon: Bell, label: "通知", match: (p: string) => p.startsWith("/notifications"), badge: unread.data ?? 0 },
    { to: "/bookmarks", icon: Bookmark, label: "书签", match: (p: string) => p.startsWith("/bookmarks") },
    {
      to: me.data ? `/u/${me.data.handle}` : "/login",
      icon: UserRound,
      label: "主页",
      match: (p: string) => me.data ? p === `/u/${me.data.handle}` : false,
    },
  ] as const;

  return (
    <aside className="sticky top-0 hidden h-dvh w-[76px] shrink-0 flex-col justify-between px-2 py-3 xl:w-[248px] md:flex">
      <div>
        <Link to="/" className="press mb-2 flex size-12 items-center justify-center rounded-full hover:bg-fg/[0.06] xl:justify-start xl:px-3">
          <OrionMark />
          <span className="ml-2 hidden font-display text-xl font-semibold tracking-tight xl:inline">Orion</span>
        </Link>
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const active = item.match(path);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "press relative flex min-h-12 items-center justify-center gap-4 rounded-full px-3 text-[20px] hover:bg-fg/[0.06] xl:justify-start",
                  active ? "font-bold" : "font-normal",
                )}
              >
                <span className="relative">
                  <Icon className="size-[26px]" strokeWidth={active ? 2.2 : 1.7} />
                  {"badge" in item && item.badge > 0 ? (
                    <span className="absolute -right-1.5 -top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => {
            if (!user) return;
            compose.openCompose();
          }}
          className="press mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[0_8px_24px_rgba(29,155,240,0.28)] xl:w-full xl:px-6"
        >
          <PenSquare className="size-5 xl:hidden" />
          <span className="hidden text-[17px] font-semibold xl:inline">发帖</span>
        </button>
      </div>
      <div className="mb-2">
        {!mounted || isPending ? (
          <div className="h-12 rounded-full skeleton" />
        ) : user ? (
          <div className="flex items-center gap-2 rounded-full p-2 hover:bg-fg/[0.06]">
            <AvatarOrb
              name={me.data?.displayName ?? user.displayName ?? "我"}
              hue={me.data?.avatarHue ?? 210}
              size="sm"
            />
            <div className="hidden min-w-0 flex-1 xl:block">
              <p className="truncate text-sm font-semibold">{me.data?.displayName ?? user.displayName}</p>
              <p className="truncate text-xs text-subtle">@{me.data?.handle ?? "…"}</p>
            </div>
            <div className="hidden xl:block">
              <UserButton />
            </div>
          </div>
        ) : (
          <Link to="/login" className="press flex h-10 items-center justify-center rounded-full bg-fg text-bg text-sm font-semibold xl:px-4">
            登录
          </Link>
        )}
      </div>
    </aside>
  );
}
