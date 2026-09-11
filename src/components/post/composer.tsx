import { Globe, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { AvatarOrb } from "@/components/ui/avatar-orb";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useMounted } from "@/lib/use-mounted";
import { useCompose } from "@/lib/forum/compose";
import { createPost, getMyProfile } from "@/lib/forum/queries";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const LIMIT = 500;

export function InlineComposer({
  communityId,
  parentId,
}: {
  communityId?: string | null;
  parentId?: string | null;
}) {
  const { user, isPending } = useCurrentUserState();
  const compose = useCompose();
  const mounted = useMounted();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  if (!mounted || isPending) return <div className="h-24 border-b border-line skeleton" />;
  if (!user) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-3 border-b border-line px-4 py-4 text-muted hover:bg-fg/[0.03]"
      >
        <span className="size-10 rounded-full bg-elevated" />
        {parentId ? "登录后回复" : "登录后发布帖子"}
      </Link>
    );
  }
  return (
    <div className="border-b border-line px-4 py-3">
      <ComposerForm
        communityId={communityId ?? compose.communityId}
        parentId={parentId}
        avatarName={me.data?.displayName ?? user.displayName ?? "我"}
        avatarHue={me.data?.avatarHue ?? 210}
        onPosted={() => compose.close()}
      />
    </div>
  );
}

export function ComposerSheet() {
  const compose = useCompose();
  const { user } = useCurrentUserState();
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMyProfile() });
  if (!compose.open || !user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="关闭"
        onClick={compose.close}
      />
      <div className="sheet-in glass relative w-full max-w-xl rounded-t-[28px] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-[28px]">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={compose.close} className="press rounded-full p-2 hover:bg-fg/10">
            <X className="size-5" />
          </button>
          <span className="text-sm font-medium text-muted">新帖子</span>
          <span className="w-9" />
        </div>
        {compose.replyTo ? (
          <p className="mb-3 line-clamp-2 rounded-[16px] bg-fg/[0.04] px-3 py-2 text-[13px] text-muted">
            回复 @{compose.replyTo.handle}：{compose.replyTo.body}
          </p>
        ) : null}
        <ComposerForm
          communityId={compose.communityId}
          parentId={compose.parentId}
          quoteId={compose.quoteId}
          avatarName={me.data?.displayName ?? user.displayName ?? "我"}
          avatarHue={me.data?.avatarHue ?? 210}
          autoFocus
          onPosted={() => compose.close()}
        />
      </div>
    </div>
  );
}

function ComposerForm({
  communityId,
  parentId,
  quoteId,
  avatarName,
  avatarHue,
  autoFocus,
  onPosted,
}: {
  communityId?: string | null;
  parentId?: string | null;
  quoteId?: string | null;
  avatarName: string;
  avatarHue: number;
  autoFocus?: boolean;
  onPosted?: () => void;
}) {
  const compose = useCompose();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [body, setBody] = useState("");
  const [cid, setCid] = useState<string | null>(communityId ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const left = LIMIT - body.length;
  const ready = body.trim().length > 0 && body.length <= LIMIT && !busy;

  async function submit() {
    if (!ready) return;
    setBusy(true);
    setError(null);
    try {
      const post = await createPost({
        data: {
          body: body.trim(),
          communityId: cid,
          parentId: parentId ?? null,
          quoteId: quoteId ?? null,
        },
      });
      setBody("");
      await qc.invalidateQueries();
      onPosted?.();
      if (post?.id && parentId) {
        void navigate({ to: "/post/$id", params: { id: parentId } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-3">
      <AvatarOrb name={avatarName} hue={avatarHue} />
      <div className="min-w-0 flex-1">
        {compose.communities.length > 0 && !parentId ? (
          <select
            value={cid ?? ""}
            onChange={(e) => setCid(e.target.value || null)}
            className="mb-1 rounded-full bg-transparent text-[13px] font-medium text-accent outline-none"
          >
            <option value="">所有人可见</option>
            {compose.communities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="mb-1 flex items-center gap-1 text-[13px] text-accent">
            <Globe className="size-3.5" />
            所有人可见
          </p>
        )}
        <textarea
          autoFocus={autoFocus}
          value={body}
          maxLength={LIMIT + 20}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void submit();
          }}
          placeholder={parentId ? "发布你的回复" : "有什么新鲜事？"}
          className="min-h-24 w-full resize-none bg-transparent text-[17px] leading-relaxed text-fg outline-none placeholder:text-subtle"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex min-h-8 items-center gap-1 text-accent">
            {error ? <span className="text-[12px] text-like">{error}</span> : null}
          </div>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "tabular-nums text-[12px]",
                left < 20 ? "text-like" : "text-subtle",
              )}
            >
              {left}
            </span>
            <button
              type="button"
              disabled={!ready}
              onClick={() => void submit()}
              className="press rounded-full bg-accent px-4 py-1.5 text-[15px] font-semibold text-accent-fg disabled:opacity-40"
            >
              {busy ? "发布中" : parentId ? "回复" : "发帖"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
