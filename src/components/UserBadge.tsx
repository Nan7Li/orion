import React from 'react';
import { TrustLevel, User } from '@/types';
import { Sparkles, Orbit, Compass, Rocket, Telescope } from 'lucide-react';

interface UserBadgeProps {
  user: User;
  showAvatar?: boolean;
  avatarSize?: 'xs' | 'sm' | 'md' | 'lg';
  showTrustLevel?: boolean;
  showBio?: boolean;
  className?: string;
}

export const getTrustLevelBadge = (level: TrustLevel) => {
  switch (level) {
    case 4:
      return {
        label: '猎户座主权官',
        subLabel: 'Orion Sovereign',
        icon: Orbit,
        color: '#f59e0b',
        bg: 'bg-amber-500/10 text-amber-500 border-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      };
    case 3:
      return {
        label: '恒星守望者',
        subLabel: 'Stellar Warden',
        icon: Sparkles,
        color: '#a855f7',
        bg: 'bg-purple-500/10 text-purple-500 border-purple-500/30 dark:bg-purple-400/15 dark:text-purple-300 dark:border-purple-400/30',
        glow: 'shadow-[0_0_8px_rgba(168,85,247,0.2)]',
      };
    case 2:
      return {
        label: '行星领航员',
        subLabel: 'Planetary Navigator',
        icon: Compass,
        color: '#10b981',
        bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-400 dark:border-emerald-400/30',
        glow: '',
      };
    case 1:
      return {
        label: '星际漫游者',
        subLabel: 'Cosmos Voyager',
        icon: Rocket,
        color: '#0284c7',
        bg: 'bg-sky-500/10 text-sky-600 border-sky-500/30 dark:bg-sky-400/15 dark:text-sky-400 dark:border-sky-400/30',
        glow: '',
      };
    default:
      return {
        label: '星尘观测者',
        subLabel: 'Stardust Observer',
        icon: Telescope,
        color: '#71717a',
        bg: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30 dark:bg-zinc-700/20 dark:text-zinc-400 dark:border-zinc-600/30',
        glow: '',
      };
  }
};

export const UserBadge: React.FC<UserBadgeProps> = ({
  user,
  showAvatar = true,
  avatarSize = 'sm',
  showTrustLevel = true,
  showBio = false,
  className = '',
}) => {
  const trust = getTrustLevelBadge(user.trustLevel);
  const Icon = trust.icon;

  const avatarSizes = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      {showAvatar && (
        <div className={`relative rounded-full overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700 ${avatarSizes[avatarSize]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center space-x-1.5 flex-wrap">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          {user.name}
        </span>
        {showTrustLevel && (
          <span
            className={`inline-flex items-center space-x-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${trust.bg} ${trust.glow}`}
            title={`宇宙星阶: Lv.${user.trustLevel} · ${trust.label} (${trust.subLabel})`}
          >
            <Icon className="w-3 h-3 flex-shrink-0" />
            <span>Lv.{user.trustLevel} {trust.label}</span>
          </span>
        )}
      </div>
      {showBio && user.bio && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xs">{user.bio}</p>
      )}
    </div>
  );
};
