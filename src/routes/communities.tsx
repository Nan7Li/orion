import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/shell/app-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { listCommunities, toggleJoinCommunity } from "@/lib/forum/queries";
import { formatCount } from "@/lib/forum/time";

export const Route = createFileRoute("/communities")({ component: CommunitiesPage });

function CommunitiesPage() {
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["communities"], queryFn: () => listCommunities() });
  const join = useMutation({
    mutationFn: (id: string) => toggleJoinCommunity({ data: id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["communities"] }),
  });

  return (
    <AppShell title="社区">
      <p className="border-b border-line px-4 py-3 text-sm text-muted">
        社区是 Orion 的兴趣星系。加入之后，成员的帖子会出现在你的「正在关注」里。
      </p>
      <ul>
        {(list.data ?? []).map((c) => (
          <li key={c.id} className="flex items-start gap-3 border-b border-line px-4 py-4">
            <Link to="/c/$slug" params={{ slug: c.slug }} className="min-w-0 flex-1">
              <p className="text-[16px] font-bold">{c.name}</p>
              <p className="mt-0.5 text-[14px] text-muted">{c.description}</p>
              <p className="mt-2 text-[13px] text-subtle">{formatCount(c.memberCount)} 成员</p>
            </Link>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  void navigate({ to: "/login" });
                  return;
                }
                join.mutate(c.id);
              }}
              className="press shrink-0 rounded-full bg-fg px-4 py-1.5 text-[13px] font-semibold text-bg"
            >
              {c.joined ? "已加入" : "加入"}
            </button>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
