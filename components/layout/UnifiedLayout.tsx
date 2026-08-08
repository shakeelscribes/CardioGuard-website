'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Activity, ShieldCheck, User as UserIcon, LayoutDashboard, History, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/predict', label: 'New Scan', icon: Activity },
  { href: '/history', label: 'Archives', icon: History },
  { href: '/statistics', label: 'Analytics', icon: BarChart2 },
  { href: '/profile', label: 'Profile', icon: UserIcon },
];

export default function UnifiedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Elegant entrance for navigation
    gsap.from(navRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
    
    // Page content transition
    gsap.from(contentRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: 'power2.out',
      delay: 0.2
    });
  }, { scope: navRef, dependencies: [pathname] });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sleek Top Navigation */}
      <header ref={navRef} className="sticky top-0 z-50 w-full glass-panel border-b-0 border-x-0 border-t-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-foreground">
                CardioGuard
              </span>
            </Link>

            {/* Nav Links */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {NAV_ITEMS.map(item => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* User / Actions */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-border">
                <span className="text-sm font-medium text-foreground">
                  {profile?.name || user.email?.split('@')[0]}
                </span>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-border object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={contentRef} className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* Global Clinical Footer */}
      <footer className="w-full border-t border-border/50 bg-background/50 backdrop-blur-md py-6 mt-auto pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] md:text-xs font-mono tracking-widest text-muted-foreground uppercase text-center md:text-left leading-relaxed max-w-3xl">
            Disclaimer: Results are generated via machine learning for informational purposes only and are not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <a href="#" onClick={(e) => { e.preventDefault(); toast("Our Privacy Policy is currently being drafted.", { icon: '📝' }); }} className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
            <span className="opacity-30">•</span>
            <a href="#" onClick={(e) => { e.preventDefault(); toast("Our Terms of Service are currently being drafted.", { icon: '⚖️' }); }} className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </footer>
      
      {/* Mobile Nav (Bottom) */}
      {user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border flex items-center justify-around p-2 pb-safe">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
