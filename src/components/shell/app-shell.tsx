import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";
import { ComposerSheet } from "@/components/post/composer.tsx";
import { MobileTabBar } from "@/components/shell/mobile-tab-bar";
import { RightRail } from "@/components/shell/right-rail";
import { SideNav } from "@/components/shell/side-nav";
import { OnboardingSheet } from "@/components/shell/onboarding";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ComposeProvider, useCompose } from "@/lib/forum/compose";
import { getMyProfile, listCommunities } from "@/lib/forum/queries";
import { useMounted } from "@/lib/use-mounted";

export function AppShell({
  children,
  title,
  hideRail = false,
  headerRight,
}: {
  children: ReactNode;
  title?: ReactNode;
  hideRail?: boolean;
  headerRight?: ReactNode;
}) {
  return (
    <ComposeProvider>
      <ShellFrame title={title} hideRail={hideRail} headerRight={headerRight}>
        {children}
      </ShellFrame>
    </ComposeProvider>
  );
}

function ShellFrame({
  children,
  title,
  hideRail,
  headerRight,
}: {
  children: ReactNode;
  title?: ReactNode;
  hideRail?: boolean;
  headerRight?: ReactNode;
}) {
  const compose = useCompose();
  const setCommunities = compose.setCommunities;
  const { user, isPending } = useCurrentUserState();
  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => getMyProfile(),
    enabled: !isPending,
  });
  const communities = useQuery({ queryKey: ["communities"], queryFn: () => listCommunities() });

  useEffect(() => {
    if (communities.data) setCommunities(communities.data);
  }, [communities.data, setCommunities]);

  const mounted = useMounted();
  const needsOnboarding = Boolean(mounted && user && !isPending && me.isFetched && !me.data);

  return (
    <div className="aurora min-h-dvh">
      <div className="mx-auto flex max-w-[1280px] justify-center">
        <SideNav />
        <main className="min-h-dvh w-full min-w-0 max-w-[600px] flex-1 border-x border-line bg-bg/40 pb-24 md:pb-0">
          {title ? (
            <header className="glass-thin sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line px-4">
              <div className="text-[17px] font-bold tracking-tight">{title}</div>
              {headerRight}
            </header>
          ) : null}
          {children}
        </main>
        {hideRail ? null : <RightRail />}
      </div>
      <MobileTabBar />
      <ComposerSheet />
      {needsOnboarding ? <OnboardingSheet /> : null}
    </div>
  );
}
