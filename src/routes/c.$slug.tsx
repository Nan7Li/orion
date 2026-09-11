import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { FeedList } from "@/components/feed/feed-list";
import { InlineComposer } from "@/components/post/composer";
import { AppShell } from "@/components/shell/app-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getCommunity, listFeed, toggleJoinCommunity } from "@/lib/forum/queries";
import { formatCount } from "@/lib/forum/time";

export const Route = createFileRoute("/c/$slug")({ component: CommunityPage });

function CommunityPage() {
  const { slug } = Route.useParams();
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const community = useQuery({ queryKey: ["community", slug], queryFn: () => getCommunity({ data: slug }) });
  const feed = useQuery({
    queryKey: ["feed", "c", slug],
    queryFn: () => listFeed({ data: { community: slug } }),
  });
  const join = useMutation({
    mutationFn: (id: string) => toggleJoinCommunity({ data: id }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["community", slug] });
      void qc.invalidateQueries({ queryKey: ["communities"] });
    },
  });
  const c = community.data;

  return (
    <AppShell
      title={
        <span className="flex items-center gap-2">
          <button type="button" onClick={() => history.back()} className="press rounded-full p-2 hover:bg-fg/10">
            <ArrowLeft className="size-5" />
          </button>
          {c?.name ?? "社区"}
        </span>
      }
    >
      {c ? (
        <section className="border-b border-line px-4 py-4">
          <p className="text-[15px] text-fg/90">{c.description}</p>
          <p className="mt-2 text-[13px] text-subtle">{formatCount(c.memberCount)} 成员</p>
          {c.rules ? (
            <p className="mt-3 rounded-[16px] bg-fg/[0.04] px-3 py-2 text-[13px] text-muted">{c.rules}</p>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (!user) {
                void navigate({ to: "/login" });
                return;
              }
              join.mutate(c.id);
            }}
            className="press mt-3 rounded-full bg-fg px-4 py-1.5 text-[13px] font-semibold text-bg"
          >
            {c.joined ? "已加入" : "加入社区"}
          </button>
        </section>
      ) : (
        <div className="h-32 skeleton" />
      )}
      <InlineComposer communityId={c?.id} />
      <FeedList posts={feed.data} empty="这个社区还很安静。成为第一个发帖的人。" />
    </AppShell>
  );
}
