'use client';

import React, { useState, useEffect } from 'react';
import { useForum } from '@/context/ForumContext';
import {
  X,
  Sparkles,
  LogIn,
  UserPlus,
  Lock,
  User,
  Mail,
  AlertCircle,
  Loader2,
  Rocket,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { TurnstileWidget } from './TurnstileWidget';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    forgotPassword,
    resetPassword,
    showToast,
  } = useForum();

  // Login inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Turnstile token
  const [turnstileToken, setTurnstileToken] = useState('');

  // Forgot / Reset inputs
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [discoveredAccount, setDiscoveredAccount] = useState<{ username: string; name: string } | null>(null);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Countdown timer for resend code
  useEffect(() => {
    if (codeCountdown <= 0) return;
    const timer = setInterval(() => {
      setCodeCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [codeCountdown]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!turnstileToken) {
      setErrorMessage('请先完成 Cloudflare 人机安全验证');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(loginUsername, loginPassword, turnstileToken);
      if (res.success) {
        setIsAuthModalOpen(false);
        setLoginUsername('');
        setLoginPassword('');
        setTurnstileToken('');
      } else {
        setErrorMessage(res.error || '登入验证失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    if (!turnstileToken) {
      setErrorMessage('请先完成 Cloudflare 人机安全验证');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(regUsername, regName, regPassword, regEmail, turnstileToken);
      if (res.success) {
        setIsAuthModalOpen(false);
        setRegUsername('');
        setRegName('');
        setRegPassword('');
        setRegEmail('');
        setTurnstileToken('');
      } else {
        setErrorMessage(res.error || '注册失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!forgotEmail || !forgotEmail.trim()) {
      setErrorMessage('请输入注册时绑定的电子邮箱');
      return;
    }
    setErrorMessage(null);
    setIsSendingCode(true);

    try {
      const res = await forgotPassword(forgotEmail.trim());
      if (res.success) {
        setCodeSent(true);
        setCodeCountdown(60);
        if (res.code) {
          setResetCode(res.code); // Autofill for convenience & testing
        }
        if (res.username) {
          setDiscoveredAccount({ username: res.username, name: res.name || res.username });
        }
        setSuccessInfo(
          res.code
            ? `星际重置验证码已生成！(测试模拟验证码: ${res.code}，已为您自动填充)`
            : '重置验证码已发送至您的电子邮箱，请查收！'
        );
        showToast('重置验证码已就绪', 'success');
      } else {
        setErrorMessage(res.error || '未找到该邮箱关联的星舰账号');
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!resetCode.trim()) {
      setErrorMessage('请输入 6 位重置验证码');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('新通行密钥长度不得少于 6 位');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('两次输入的新密码不一致');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword(forgotEmail.trim(), resetCode.trim(), newPassword);
      if (res.success) {
        setIsAuthModalOpen(false);
        setForgotEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        setCodeSent(false);
      } else {
        setErrorMessage(res.error || '重置密码失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for existing seeded accounts
  const handleQuickFill = (u: string, p: string = 'orion123') => {
    setLoginUsername(u);
    setLoginPassword(p);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-[#0e131d] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-md shadow-indigo-600/30 flex-shrink-0">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center space-x-1.5">
                <span>ORION</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase font-mono">
                  DO
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {authModalTab === 'forgot'
                  ? '星轨账号找回 · 密钥安全重置中心'
                  : '猎户座开发者星河 · 通行证验证中心'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('login');
              setErrorMessage(null);
              setSuccessInfo(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === 'login'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>航行登入</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalTab('register');
              setErrorMessage(null);
              setSuccessInfo(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === 'register'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>跃迁注册</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalTab('forgot');
              setErrorMessage(null);
              setSuccessInfo(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition-all flex items-center justify-center space-x-1.5 ${
              authModalTab === 'forgot'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>找回账号</span>
          </button>
        </div>

        {/* Error banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success banner */}
        {successInfo && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="leading-relaxed">{successInfo}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {authModalTab === 'login' ? (
            /* Login Form (Supports Email or Username Login) */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>电子邮箱 或 用户名 (Email / Username)</span>
                </label>
                <input
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="例如：nan7li@nan77a.com 或 nan7li"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>通行密钥 (密码)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('forgot');
                      setErrorMessage(null);
                      setSuccessInfo(null);
                      if (loginUsername.includes('@')) {
                        setForgotEmail(loginUsername);
                      }
                    }}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    忘记密码 / 邮箱找回？
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="输入您的访问密钥..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              {/* Cloudflare Turnstile Security Verification */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                  <span className="flex items-center space-x-1 font-semibold text-zinc-700 dark:text-zinc-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Cloudflare 智能安全防护</span>
                  </span>
                  {turnstileToken && (
                    <span className="text-emerald-500 font-mono text-[10px] flex items-center space-x-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>已通过人机验证</span>
                    </span>
                  )}
                </div>
                <TurnstileWidget
                  key={`login-turnstile-${authModalTab}`}
                  onVerify={(token) => {
                    setTurnstileToken(token);
                    setErrorMessage(null);
                  }}
                  onExpire={() => setTurnstileToken('')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginUsername.trim() || !loginPassword.trim() || !turnstileToken}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在校验 Cloudflare D1 密钥...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>登入星舰网络</span>
                  </>
                )}
              </button>

              {/* Quick Fill Test Accounts */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <p className="text-[11px] text-zinc-400 mb-2 font-medium">⚡ 快捷填入体验账号（支持用户名或邮箱登入）：</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('nan7li@nan77a.com')}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[11px] font-mono border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                  >
                    ✉️ nan7li@nan77a.com (邮箱登入)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('nan7li')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] transition-colors"
                  >
                    nan7li (用户名)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('neo')}
                    className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] transition-colors"
                  >
                    neo (Lv.4 主权官)
                  </button>
                </div>
              </div>
            </form>
          ) : authModalTab === 'register' ? (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>星舰呼号 (唯一 Username，英文字母/数字/下划线)</span>
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="例如：orion_voyager"
                  pattern="[a-zA-Z0-9_-]+"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>绑定电子邮箱 (重要：用于邮箱登入与找回密码)</span>
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  <span>星际展示昵称 (Display Name)</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="例如：猎户深空探索者"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>设置通行密钥 (至少 6 位密码)</span>
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="输入至少 6 位的访问密码..."
                  minLength={6}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-700 dark:text-indigo-300 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>新晋星友礼遇：</span>
                </div>
                <p>完成跃迁即授予【Lv.1 星际漫游者】天体头衔，点亮初始徽章，解锁全星域发帖与表情交互。</p>
              </div>

              {/* Cloudflare Turnstile Anti-Bot Protection */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
                  <span className="flex items-center space-x-1 font-semibold text-zinc-700 dark:text-zinc-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cloudflare 防脚本与防批量注册安全盾</span>
                  </span>
                  {turnstileToken && (
                    <span className="text-emerald-500 font-mono text-[10px] flex items-center space-x-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>已通过人机验证</span>
                    </span>
                  )}
                </div>
                <TurnstileWidget
                  key={`register-turnstile-${authModalTab}`}
                  onVerify={(token) => {
                    setTurnstileToken(token);
                    setErrorMessage(null);
                  }}
                  onExpire={() => setTurnstileToken('')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !regUsername.trim() || !regEmail.trim() || regPassword.length < 6 || !turnstileToken}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在写入 D1 边缘节点...</span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    <span>跃迁注册并立即登入</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Forgot Password & Account Recovery Form */
            <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
              {/* Step 1: Input registered email to locate account & request code */}
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>注册时绑定的电子邮箱</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="例如：nan7li@nan77a.com"
                    disabled={codeSent && codeCountdown > 0}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSendingCode || !forgotEmail.trim() || codeCountdown > 0}
                    className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-colors flex items-center space-x-1.5 flex-shrink-0"
                  >
                    {isSendingCode ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{codeCountdown > 0 ? `${codeCountdown}s 后重发` : '获取验证码'}</span>
                  </button>
                </div>
              </div>

              {/* Found account hint */}
              {discoveredAccount && (
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span>
                      已匹配星舰呼号：<strong className="font-mono">@{discoveredAccount.username}</strong> ({discoveredAccount.name})
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2: Input 6-digit code */}
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                  <span>6 位安全验证码 (Valid for 15 mins)</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.trim())}
                  placeholder="输入邮件中的 6 位数字验证码"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono tracking-wider text-sm"
                  required
                />
              </div>

              {/* Step 3: New Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>新通行密钥</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="至少 6 位新密码"
                    minLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>确认新密钥</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入新密码"
                    minLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !forgotEmail.trim() || !resetCode.trim() || newPassword.length < 6}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在重置 D1 密钥并登入...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>重置密钥并登入星舰</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setErrorMessage(null);
                    setSuccessInfo(null);
                  }}
                  className="inline-flex items-center space-x-1 text-xs text-zinc-400 hover:text-indigo-500 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>想起密码了？返回登入</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
