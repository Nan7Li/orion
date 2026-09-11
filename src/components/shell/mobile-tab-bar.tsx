import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, House, Search, UserRound, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile, unreadCount } from "@/lib/forum/queries";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  const unread = useQuery({ queryKey: ["unread"], queryFn: () => unreadCount() });
  const profileTo = me.data ? `/u/${me.data.handle}` : "/login";
  const items = [
    { to: "/", icon: House, label: "首页", active: path === "/" },
    { to: "/explore", icon: Search, label: "探索", active: path.startsWith("/explore") },
    { to: "/communities", icon: Users, label: "社区", active: path.startsWith("/communities") || path.startsWith("/c/") },
    { to: "/notifications", icon: Bell, label: "通知", active: path.startsWith("/notifications"), badge: unread.data ?? 0 },
    { to: profileTo, icon: UserRound, label: "我", active: me.data ? path === `/u/${me.data.handle}` : path === "/login" },
  ];
  return (
    <nav
      className="glass pointer-events-auto fixed inset-x-3 z-40 flex h-14 items-center justify-around rounded-full px-2 md:hidden"
      style={{ bottom: "max(0.6rem, env(safe-area-inset-bottom))" }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.label}
            to={item.to}
            aria-label={item.label}
            className={cn(
              "press relative grid size-11 place-items-center rounded-full",
              item.active ? "text-fg" : "text-subtle",
            )}
          >
            <Icon className="size-6" strokeWidth={item.active ? 2.3 : 1.7} />
            {item.badge && item.badge > 0 ? (
              <span className="absolute right-1 top-1 size-2 rounded-full bg-accent" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
