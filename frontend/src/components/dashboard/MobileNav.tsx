import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  icon: LucideIcon;
  label: string;
  id: string;
}

interface MobileNavProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  items,
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50">
      <div className="flex justify-around items-center px-2 py-2 max-w-lg mx-auto">
        {items.map((item) => (
          <MobileNavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
          />
        ))}
      </div>
    </nav>
  );
};

interface MobileNavButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]',
        active
          ? 'text-primary'
          : 'text-muted-foreground'
      )}
    >
      <div className="relative">
        <Icon size={22} />
        {active && (
          <motion.div
            layoutId="mobileActiveIndicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-glow"
          />
        )}
      </div>
      <span className={cn(
        'text-[10px] font-medium truncate max-w-full',
        active && 'text-primary'
      )}>
        {label}
      </span>
    </button>
  );
};

export default MobileNav;
