import React from 'react';
import { Category } from '@/types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showDescription = false,
  clickable = false,
  onClick,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1.5',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-sm px-3 py-1.5 space-x-2',
  };

  return (
    <span
      onClick={clickable ? onClick : undefined}
      style={{
        backgroundColor: category.bgColor,
        borderColor: `${category.color}40`,
        color: category.color,
      }}
      className={`inline-flex items-center rounded-md font-medium border transition-all duration-150 ${
        sizeClasses[size]
      } ${clickable ? 'cursor-pointer hover:opacity-85 hover:scale-[1.02]' : ''}`}
      title={category.description}
    >
      <span
        className="w-2 h-2 rounded-full inline-block flex-shrink-0 animate-pulse"
        style={{ backgroundColor: category.color }}
      />
      <span className="font-semibold tracking-wide">{category.name}</span>
      {showDescription && (
        <span className="text-zinc-400 dark:text-zinc-500 font-normal hidden sm:inline text-[11px] ml-1">
          {category.description}
        </span>
      )}
    </span>
  );
};
