'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShieldCheck, Loader2, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.auth-form', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, { scope: container });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      toast.success('Password updated successfully.');
      router.push('/profile');
    } catch (err: any) {
      toast.error(err.message || 'Renewal failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-background" ref={container}>
      <div className="w-full flex flex-col items-center justify-center p-8 relative">
        <Link href="/profile" className="absolute top-8 left-8 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold">
          <ArrowLeft className="w-4 h-4" /> Return to Profile
        </Link>
        
        <div className="w-full max-w-md auth-form">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              Update Password
            </h2>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest font-semibold">
              Establish a new cryptographic key
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-mono tracking-widest text-muted-foreground uppercase font-semibold">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl border-border bg-muted/50 focus-visible:bg-background"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-mono tracking-widest text-muted-foreground uppercase font-semibold">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl border-border bg-muted/50 focus-visible:bg-background"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="w-full h-12 rounded-xl text-base font-bold font-sans bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
