'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ShieldCheck, Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

type AuthState = 'login' | 'signup' | 'verify-signup' | 'forgot-password' | 'verify-reset' | 'update-password';

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, verifyOtp, resetPasswordForEmail, updatePassword } = useAuth();
  const container = useRef<HTMLDivElement>(null);
  
  const [authState, setAuthState] = useState<AuthState>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  
  const [status, setStatus] = useState<'checking' | 'optimal' | 'failed'>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('https://cardiovascluar-backend.onrender.com', { method: 'GET' });
        if (res.ok) {
          setStatus('optimal');
        } else {
          setStatus('failed');
        }
      } catch (e) {
        setStatus('failed');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.auth-branding', 
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );
    tl.fromTo('.auth-form-container', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      "-=0.6"
    );
    gsap.to('.ambient-glow', {
      opacity: 0.6, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut'
    });
  }, { scope: container });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      toast.success('Access Granted');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error('Please enter email and password');
    setLoading(true);
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      toast.success('OTP sent! Please check your email.');
      setAuthState('verify-signup');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifySignup(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter a 6-digit OTP');
    setLoading(true);
    try {
      const { error } = await verifyOtp(email, otp, 'signup');
      if (error) throw error;
      toast.success('Email verified! You can now log in.');
      setAuthState('login');
      setOtp('');
      setPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      const { error } = await resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset OTP sent to your email!');
      setAuthState('verify-reset');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyReset(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter a 6-digit OTP');
    setLoading(true);
    try {
      const { error } = await verifyOtp(email, otp, 'recovery');
      if (error) throw error;
      toast.success('OTP verified! Please enter your new password.');
      setAuthState('update-password');
      setOtp('');
      setPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return toast.error('Please enter a new password');
    setLoading(true);
    try {
      const { error } = await updatePassword(password);
      if (error) throw error;
      toast.success('Password updated successfully!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Google authentication failed');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background relative" ref={container}>
      
      {/* Left Branding Panel (Diagnostic Terminal Aesthetic) */}
      <div className="auth-branding hidden lg:flex w-1/2 bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden flex-col justify-between p-12 border-r border-border/50">
        <div className="ambient-glow absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="ambient-glow absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        
        <div className="absolute inset-0 opacity-[0.02] overflow-hidden -z-10 flex pointer-events-none">
           <div className="whitespace-nowrap text-[200px] font-bold text-primary flex animate-[slide_20s_linear_infinite]">
              /\/\___/\/\___/\/\___/\/\___/\/\___/\/\___/\/\___
           </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16 cursor-pointer group w-fit" onClick={() => router.push('/')}>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform border border-primary/20 backdrop-blur-sm shadow-[0_0_20px_rgba(var(--primary),0.2)]">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="font-heading font-bold text-3xl tracking-tight text-foreground drop-shadow-md">CardioGuard</span>
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-heading font-bold leading-[1.1] mb-6 tracking-tight max-w-xl text-foreground">
            Precision<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Cardiovascular</span><br/>
            Intelligence.
          </h1>
          <p className="text-muted-foreground font-sans text-lg max-w-md leading-relaxed">
            Advanced machine learning algorithms providing clinical-grade risk assessments for preventive cardiology.
          </p>
        </div>

        <div className={`relative z-10 flex items-center gap-4 text-foreground font-sans text-[11px] uppercase tracking-widest font-bold bg-background/50 w-fit px-5 py-3 rounded-full border ${status === 'failed' ? 'border-red-500/30' : status === 'checking' ? 'border-yellow-500/30' : 'border-green-500/30'} backdrop-blur-md shadow-lg transition-colors`}>
          <div className={`flex items-center justify-center w-2 h-2 rounded-full ${status === 'failed' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse' : status === 'checking' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'} transition-colors`} />
          <span>System Status: {status === 'failed' ? 'Degraded / Offline' : status === 'checking' ? 'Checking...' : 'Optimal & Secure'}</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-container w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
        
        {/* Mobile Header */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2 text-primary cursor-pointer" onClick={() => router.push('/')}>
          <ShieldCheck className="w-8 h-8" />
          <span className="font-heading font-bold text-xl tracking-tight">CardioGuard</span>
        </div>

        <div className="w-full max-w-[420px] mt-16 lg:mt-0">
          
          {(authState !== 'login' && authState !== 'signup') && (
            <button onClick={() => setAuthState('login')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          )}

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-heading font-bold text-foreground mb-3 tracking-tight">
              {authState === 'login' && 'Welcome Back'}
              {authState === 'signup' && 'Create Account'}
              {(authState === 'verify-signup' || authState === 'verify-reset') && 'Verify OTP'}
              {authState === 'forgot-password' && 'Reset Password'}
              {authState === 'update-password' && 'New Password'}
            </h2>
            <p className="text-muted-foreground font-sans text-base font-medium">
              {authState === 'login' && 'Log in to access your clinical dashboard'}
              {authState === 'signup' && 'Register to start analyzing cardiovascular health'}
              {(authState === 'verify-signup' || authState === 'verify-reset') && 'Enter the 6-digit code sent to your email'}
              {authState === 'forgot-password' && 'Enter your email to receive a recovery code'}
              {authState === 'update-password' && 'Enter your new secure password below'}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* OAuth Buttons (Only for login/signup) */}
            {(authState === 'login' || authState === 'signup') && (
              <>
                <Button type="button" variant="outline" onClick={handleGoogleSignIn} disabled={googleLoading || loading} className="w-full h-12 rounded-xl font-sans text-sm font-bold shadow-sm border-border/80 hover:bg-muted/50 transition-colors flex items-center justify-center gap-3">
                  {googleLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-[11px] uppercase">
                    <span className="bg-background px-4 text-muted-foreground font-sans tracking-widest font-bold">Or continue with email</span>
                  </div>
                </div>
              </>
            )}

            <form 
              onSubmit={
                authState === 'login' ? handleLogin : 
                authState === 'signup' ? handleSignup : 
                authState === 'verify-signup' ? handleVerifySignup :
                authState === 'forgot-password' ? handleForgotPassword :
                authState === 'verify-reset' ? handleVerifyReset :
                handleUpdatePassword
              } 
              className="space-y-5"
            >
              
              {/* Email Input */}
              {(authState === 'login' || authState === 'signup' || authState === 'forgot-password') && (
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-sans font-bold tracking-wider text-muted-foreground uppercase">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                    <Input id="email" type="email" placeholder="doctor@clinic.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 h-12 rounded-xl bg-background border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans text-base shadow-sm" required />
                  </div>
                </div>
              )}

              {/* Password Input */}
              {(authState === 'login' || authState === 'signup' || authState === 'update-password') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-sans font-bold tracking-wider text-muted-foreground uppercase">
                      {authState === 'update-password' ? 'New Password' : 'Password'}
                    </Label>
                    {authState === 'login' && (
                      <button type="button" onClick={() => setAuthState('forgot-password')} className="text-xs font-sans font-bold text-primary hover:underline">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-12 h-12 rounded-xl bg-background border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans text-base shadow-sm" required minLength={6} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* OTP Input */}
              {(authState === 'verify-signup' || authState === 'verify-reset') && (
                <div className="space-y-4 flex flex-col items-center">
                  <Label className="text-xs font-sans font-bold tracking-wider text-muted-foreground uppercase text-center w-full block">6-Digit Code</Label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="justify-center">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-12 h-14 text-lg bg-background" />
                      <InputOTPSlot index={1} className="w-12 h-14 text-lg bg-background" />
                      <InputOTPSlot index={2} className="w-12 h-14 text-lg bg-background" />
                      <InputOTPSlot index={3} className="w-12 h-14 text-lg bg-background" />
                      <InputOTPSlot index={4} className="w-12 h-14 text-lg bg-background" />
                      <InputOTPSlot index={5} className="w-12 h-14 text-lg bg-background" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              )}

              <Button type="submit" disabled={loading || googleLoading} className="w-full h-12 rounded-xl font-sans text-sm uppercase tracking-wider font-bold mt-2 shadow-md hover:shadow-lg transition-all duration-300">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  authState === 'login' ? 'Log In' : 
                  authState === 'signup' ? 'Create Account' : 
                  (authState === 'verify-signup' || authState === 'verify-reset') ? 'Verify Code' :
                  authState === 'forgot-password' ? 'Send Reset Link' :
                  'Update Password'
                )}
              </Button>
            </form>

            {(authState === 'login' || authState === 'signup') && (
              <div className="pt-6 text-center">
                <button onClick={() => setAuthState(authState === 'login' ? 'signup' : 'login')} className="text-sm font-sans text-muted-foreground hover:text-foreground font-medium transition-colors" type="button">
                  {authState === 'login' ? (
                    <span>Don't have an account? <span className="text-primary font-bold">Sign up</span></span>
                  ) : (
                    <span>Already have an account? <span className="text-primary font-bold">Log in</span></span>
                  )}
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
