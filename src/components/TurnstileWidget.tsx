'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

const TURNSTILE_SITEKEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAAEpRBYS-ySS6TpRE';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'dark' | 'light' | 'auto';
          size?: 'normal' | 'flexible' | 'compact';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  onExpire,
  onError,
  theme = 'dark',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const renderWidget = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      // If already rendered, reset
      if (widgetIdRef.current) {
        try {
          window.turnstile.reset(widgetIdRef.current);
          return;
        } catch {}
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          callback: (token: string) => {
            if (isMounted) {
              setHasError(false);
              onVerify(token);
            }
          },
          'expired-callback': () => {
            if (isMounted) {
              onExpire?.();
            }
          },
          'error-callback': () => {
            if (isMounted) {
              setHasError(true);
              onError?.();
            }
          },
          theme: theme,
          size: 'flexible',
        });
        widgetIdRef.current = id;
        setIsLoaded(true);
      } catch (e) {
        console.warn('Turnstile render exception:', e);
        setHasError(true);
      }
    };

    // Check if turnstile script already loaded
    if (window.turnstile) {
      renderWidget();
    } else {
      // Check if script tag is already in DOM
      let script = document.querySelector('script[src*="turnstile"]') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          if (isMounted) renderWidget();
        }
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        if (isMounted && !window.turnstile) {
          setHasError(true);
        }
      }, 8000);

      return () => {
        isMounted = false;
        clearInterval(checkInterval);
        clearTimeout(timeout);
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          } catch {}
        }
      };
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        } catch {}
      }
    };
  }, [onVerify, onExpire, onError, theme]);

  const handleManualRetry = () => {
    setHasError(false);
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`w-full flex flex-col items-center my-2 ${className}`}>
      {/* Cloudflare Turnstile Container */}
      <div
        ref={containerRef}
        className="min-h-[65px] w-full flex items-center justify-center rounded-xl overflow-hidden"
      />

      {/* Loading state indicator before Turnstile script initializes */}
      {!isLoaded && !hasError && (
        <div className="flex items-center space-x-2 text-[11px] text-zinc-400 dark:text-zinc-500 py-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          <span>正在启动 Cloudflare 智能安全防护...</span>
        </div>
      )}

      {/* Fallback in case of script load failure */}
      {hasError && (
        <div className="flex items-center justify-between w-full p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs mt-1">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>安全盾加载受阻，请检查网络或点击重试</span>
          </div>
          <button
            type="button"
            onClick={handleManualRetry}
            className="p-1 hover:bg-amber-500/20 rounded-lg transition-colors ml-2"
            title="重试"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
