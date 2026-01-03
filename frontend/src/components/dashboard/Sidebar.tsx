import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  icon: LucideIcon;
  label: string;
  id: string;
}

interface SidebarProps {
  items: NavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeTab,
  onTabChange,
  collapsed,
  onCollapsedChange,
}) => {
  return (
    <motion.nav
      className={cn(
        'hidden lg:flex flex-col glass-strong rounded-2xl p-3 transition-all duration-300 sticky top-24 h-fit',
        collapsed ? 'w-16' : 'w-56'
      )}
      animate={{ width: collapsed ? 64 : 224 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-1">
        {items.map((item) => (
          <NavButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
            collapsed={collapsed}
          />
        ))}
      </div>
      
      <div className="mt-auto pt-4 border-t border-border/50">
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl',
            'text-muted-foreground hover:text-foreground hover:bg-muted/50',
            'transition-all duration-200'
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium overflow-hidden whitespace-nowrap"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.nav>
  );
};

interface NavButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  collapsed,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
        active
          ? 'bg-primary/10 text-primary shadow-inner-glow'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
        collapsed && 'justify-center'
      )}
    >
      <Icon size={20} className={cn(active && 'drop-shadow-lg')} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="font-medium text-sm overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {active && !collapsed && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-glow"
        />
      )}
    </button>
  );
};

export default Sidebar;
