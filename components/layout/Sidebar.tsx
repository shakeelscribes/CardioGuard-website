'use client';
// components/layout/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Activity, History, BarChart3,
  User, Heart, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/predict', icon: Activity, label: 'New Prediction' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/statistics', icon: BarChart3, label: 'Statistics' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] z-40',
        'flex flex-col py-6',
        'bg-white/85 dark:bg-dark-surface/85 backdrop-blur-lg',
        'border-r border-outline-variant/20 dark:border-dark-border',
        'shadow-ambient overflow-hidden hidden md:flex'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-8 w-6 h-6 rounded-full',
          'bg-white dark:bg-dark-surface border border-outline-variant/30 dark:border-dark-border',
          'flex items-center justify-center shadow-card',
          'hover:border-primary transition-all text-on-surface-variant hover:text-primary'
        )}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* User mini profile */}
      <div className={cn('px-4 pb-6 border-b border-outline-variant/15 dark:border-dark-border', collapsed && 'px-2')}>
        <Link href="/profile" className={cn('flex items-center gap-3 hover:opacity-80 transition-opacity', collapsed && 'justify-center')}>
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile" 
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary-gradient flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {profile?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <p className="text-sm font-semibold text-on-surface truncate">
                  {profile?.name || 'User'}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {profile?.email || ''}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-2 pt-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                className={cn(
                  'nav-item',
                  collapsed && 'justify-center px-2',
                  isActive && 'active'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : '')} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="truncate"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom logo */}
      <div className={cn('px-4 pt-4 border-t border-outline-variant/15 dark:border-dark-border', collapsed && 'px-2')}>
        <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
          <div className="w-7 h-7 rounded-lg bg-primary-gradient flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-semibold gradient-text"
              >
                CardioGuard
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}
