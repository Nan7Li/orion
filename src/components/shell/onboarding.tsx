import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { completeOnboarding } from "@/lib/forum/queries";
import { HANDLE_RE, handleFromEmail, normalizeHandle } from "@/lib/forum/text";
import { OrionMark } from "./side-nav";

export function OnboardingSheet() {
  const user = useCurrentUser();
  const qc = useQueryClient();
  const [handle, setHandle] = useState(() =>
    handleFromEmail(user?.primaryEmail ?? user?.displayName ?? "orion"),
  );
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const h = normalizeHandle(handle);
    if (!HANDLE_RE.test(h)) {
      setError("呼号需为 3–20 位字母、数字或下划线");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await completeOnboarding({
        data: { handle: h, displayName: displayName.trim() || h, bio },
      });
      await qc.invalidateQueries({ queryKey: ["me"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "无法保存");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm">
      <form
        onSubmit={(e) => void submit(e)}
        className="sheet-in glass w-full max-w-md rounded-[28px] p-6"
      >
        <OrionMark className="size-9" />
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight">完善你的 Orion 身份</h2>
        <p className="mt-1 text-sm text-muted">选一个呼号，它会出现在每条帖子旁边。</p>
        <label className="mt-5 block text-[13px] font-medium text-muted">呼号</label>
        <div className="mt-1 flex h-12 items-center rounded-[16px] border border-line bg-bg/40 px-3">
          <span className="text-subtle">@</span>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="h-full w-full bg-transparent px-1 text-[15px] outline-none"
            autoComplete="username"
          />
        </div>
        <label className="mt-3 block text-[13px] font-medium text-muted">显示名称</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 h-12 w-full rounded-[16px] border border-line bg-bg/40 px-3 text-[15px] outline-none"
        />
        <label className="mt-3 block text-[13px] font-medium text-muted">简介（可选）</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={160}
          className="mt-1 min-h-20 w-full rounded-[16px] border border-line bg-bg/40 p-3 text-[15px] outline-none"
        />
        {error ? <p className="mt-2 text-[13px] text-like">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="press mt-5 h-12 w-full rounded-full bg-fg text-[15px] font-semibold text-bg disabled:opacity-50"
        >
          {busy ? "保存中…" : "进入社区"}
        </button>
      </form>
    </div>
  );
}
