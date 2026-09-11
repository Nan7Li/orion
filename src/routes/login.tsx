import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { OrionMark } from "@/components/shell/side-nav";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { completeOnboarding } from "@/lib/forum/queries";
import { HANDLE_RE, handleFromEmail, normalizeHandle } from "@/lib/forum/text";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({ component: Login });

type Mode = "signin" | "signup";

function Login() {
  const [mode, setMode] = useState<Mode>("signup");
  return (
    <div className="aurora flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="sheet-in glass w-full max-w-[420px] rounded-[32px] p-6 sm:p-8">
        <Link to="/" className="flex items-center gap-2">
          <OrionMark />
          <span className="font-display text-lg font-semibold tracking-tight">Orion</span>
        </Link>
        <h1 className="mt-6 font-display text-[28px] font-semibold leading-tight tracking-tight">
          {mode === "signup" ? "加入社区" : "欢迎回来"}
        </h1>
        <p className="mt-1 text-sm text-muted">连接思想 · 星辰大海。用真实身份发帖、回帖、建立社区。</p>
        {authEnabled ? (
          <>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
                  className="press h-12 rounded-[16px] border border-line bg-fg/[0.03] text-[14px] font-semibold hover:bg-fg/[0.06]"
                >
                  使用 {p.label}
                </button>
              ))}
            </div>
            <div className="my-5 flex items-center gap-3 text-[12px] text-subtle">
              <span className="h-px flex-1 bg-line" />
              或使用邮箱
              <span className="h-px flex-1 bg-line" />
            </div>
            {mode === "signup" ? <SignUpForm /> : <SignInForm />}
            <button
              type="button"
              className="mt-5 w-full text-center text-[13px] text-muted"
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            >
              {mode === "signup" ? "已有账号？登录" : "没有账号？注册"}
            </button>
          </>
        ) : (
          <p className="mt-6 text-sm text-muted">注册暂未开放。</p>
        )}
      </div>
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await authClient.signIn.email({ email: email.trim(), password });
    setBusy(false);
    if (err) {
      setError(err.message ?? "邮箱或密码不正确");
      return;
    }
    void navigate({ to: "/" });
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-3">
      <Field label="邮箱" type="email" value={email} onChange={setEmail} autoComplete="email" />
      <Field label="密码" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
      {error ? <p className="text-[13px] text-like">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="press mt-2 h-12 w-full rounded-full bg-fg text-[15px] font-semibold text-bg disabled:opacity-50"
      >
        {busy ? "登录中…" : "登录"}
      </button>
    </form>
  );
}

function SignUpForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const strength = passwordScore(password);
  const h = normalizeHandle(handle || handleFromEmail(email || "user"));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!HANDLE_RE.test(h)) {
      setError("呼号需为 3–20 位字母、数字或下划线");
      return;
    }
    if (password.length < 8) {
      setError("密码至少 8 位");
      return;
    }
    if (password !== confirm) {
      setError("两次输入的密码不一致");
      return;
    }
    if (!agree) {
      setError("请先阅读并同意社区公约");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await authClient.signUp.email({
      email: email.trim(),
      password,
      name: displayName.trim() || h,
    });
    if (err) {
      setBusy(false);
      setError(err.message ?? "注册失败");
      return;
    }
    try {
      await completeOnboarding({
        data: { handle: h, displayName: displayName.trim() || h, bio: "" },
      });
    } catch (onboardErr) {
      setBusy(false);
      setError(onboardErr instanceof Error ? onboardErr.message : "呼号不可用");
      return;
    }
    setBusy(false);
    void navigate({ to: "/" });
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-3">
      <Field label="邮箱" type="email" value={email} onChange={(v) => {
        setEmail(v);
        if (!handle) setHandle(handleFromEmail(v));
      }} autoComplete="email" />
      <Field label="显示名称" value={displayName} onChange={setDisplayName} autoComplete="nickname" />
      <label className="block text-[13px] font-medium text-muted">呼号</label>
      <div className="flex h-12 items-center rounded-[16px] border border-line bg-bg/50 px-3">
        <span className="text-subtle">@</span>
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value.toLowerCase())}
          autoComplete="username"
          className="h-full w-full bg-transparent px-1 text-[15px] outline-none"
        />
      </div>
      <Field label="密码" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
      <PasswordMeter score={strength} />
      <Field label="确认密码" type="password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
      <label className="flex items-start gap-2 pt-1 text-[13px] text-muted">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 size-4 accent-accent"
        />
        <span>
          我同意友善讨论、注明出处、不对人。发帖即代表加入 Orion 社区公约。
        </span>
      </label>
      {error ? <p className="text-[13px] text-like">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="press h-12 w-full rounded-full bg-fg text-[15px] font-semibold text-bg disabled:opacity-50"
      >
        {busy ? "创建中…" : "创建账号"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-12 w-full rounded-[16px] border border-line bg-bg/50 px-3 text-[15px] outline-none focus:border-accent"
      />
    </label>
  );
}

function passwordScore(password: string): number {
  let s = 0;
  if (password.length >= 8) s += 1;
  if (password.length >= 12) s += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s += 1;
  if (/\d/.test(password)) s += 1;
  if (/[^A-Za-z0-9]/.test(password)) s += 1;
  return Math.min(s, 4);
}

function PasswordMeter({ score }: { score: number }) {
  const labels = ["太短", "较弱", "一般", "不错", "很强"];
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full",
            i < score ? "bg-accent" : "bg-line",
          )}
        />
      ))}
      <span className="w-10 text-right text-[11px] text-subtle">{labels[score]}</span>
    </div>
  );
}
