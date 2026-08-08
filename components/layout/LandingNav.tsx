'use client';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function LandingNav() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/70 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,93,172,0.4)] transition-all duration-300">
            <ShieldCheck className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tighter text-foreground group-hover:text-primary transition-colors">
            CardioGuard
          </span>
        </Link>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#how-it-works" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative group">
            How It Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
          <Link href="#ml-engine" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative group">
            Technology
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
          <Link href="#security" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors relative group">
            Security
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button className="rounded-full px-6 h-11 font-bold text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all gap-2 shadow-none hover:shadow-[0_0_20px_rgba(0,93,172,0.15)]">
                Enter Console <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth" className="hidden sm:block text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                Log In
              </Link>
              <Link href="/auth">
                <Button className="rounded-full px-6 h-11 font-bold text-sm bg-foreground text-background hover:bg-foreground/90 transition-all gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
