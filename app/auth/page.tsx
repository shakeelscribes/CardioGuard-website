'use client';
// app/auth/page.tsx - Authentication page
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Heart, Eye, EyeOff, Loader2, Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup' | 'otp' | 'forgot-password'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    otp: '',
  });

  useEffect(() => {
    const paramMode = searchParams.get('mode');
    if (paramMode === 'signup') setMode('signup');
  }, [searchParams]);

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      setOtpEmail(form.email);
      setMode('otp');
      toast.success('Verification email sent!');
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: otpEmail,
        token: form.otp,
        type: 'signup',
      });
      if (error) throw error;
      toast.success('Email verified! Welcome to CardioGuard!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    try {
      await supabase.auth.resend({ type: 'signup', email: otpEmail });
      toast.success('Verification email resent!');
    } catch {
      toast.error('Failed to resend. Please try again.');
    }
  }

  async function handleForgotPassword(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.email) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        // Log the error but don't show it to the user to prevent enumeration
        console.error('Reset password error:', error);
      }
      setResetEmailSent(true);
      setResendCountdown(60);
    } catch (err: any) {
      console.error('Failed to send reset email:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Google Sign-In failed');
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative animated-gradient-bg items-center justify-center overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-cyan-400/10 blur-xl" />

        <div className="relative z-10 text-center px-12">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm items-center justify-center mb-8 shadow-ambient-lg"
          >
            <Heart className="w-12 h-12 text-white fill-white" />
          </motion.div>

          <h2 className="font-jakarta text-4xl font-bold text-white mb-4">
            Your heart health journey starts here.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Join thousands who are proactively managing their cardiovascular risk with AI-powered insights.
          </p>

          {/* Floating badges */}
          <div className="mt-10 flex flex-col gap-3">
            {['95%+ Clinical Accuracy', 'HIPAA Compliant', 'Free to Start'].map((badge, i) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 text-left"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span className="text-white/90 text-sm font-medium">{badge}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background dark:bg-dark-background">
        <div className="w-full max-w-md">
          {/* Back to home */}
          <Link href="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-jakarta font-bold text-lg gradient-text">CardioGuard</span>
          </div>

          <AnimatePresence mode="wait">
            {/* OTP Verification Mode */}
            {mode === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="font-jakarta text-2xl font-bold text-on-surface dark:text-white mb-2">Check your email</h1>
                  <p className="text-on-surface-variant text-sm">
                    We sent a 6-digit code to <strong>{otpEmail}</strong>
                  </p>
                </div>

                <form onSubmit={handleOtpVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-2">Verification Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={form.otp}
                      onChange={e => updateForm('otp', e.target.value)}
                      className="input-field text-center text-2xl tracking-widest font-bold"
                      required
                    />
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                  </button>
                </form>

                <p className="text-center text-on-surface-variant text-sm mt-6">
                  Didn't get the email?{' '}
                  <button onClick={resendOtp} className="text-primary font-medium hover:underline">
                    Resend
                  </button>
                </p>
              </motion.div>
            )}

            {/* Login / Signup Forms */}
            {mode !== 'otp' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white mb-2">
                  {mode === 'login' ? 'Welcome back' : mode === 'forgot-password' && resetEmailSent ? 'Check your email' : mode === 'forgot-password' ? 'Reset password' : 'Create account'}
                </h1>
                <p className="text-on-surface-variant text-sm mb-8">
                  {mode === 'login'
                    ? 'Sign in to access your health dashboard'
                    : mode === 'forgot-password' && resetEmailSent
                    ? `If an account is associated with ${form.email}, you will receive a password reset link shortly.`
                    : mode === 'forgot-password'
                    ? 'Enter your email address and we will send you a link to reset your password'
                    : 'Start your cardiovascular health journey today'}
                </p>

                {/* Tab switcher */}
                {mode !== 'forgot-password' && (
                <div className="flex bg-surface-container dark:bg-dark-surface rounded-xl p-1 mb-6">
                  {(['login', 'signup'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMode(tab)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        mode === tab
                          ? 'bg-white dark:bg-dark-card text-primary shadow-card'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {tab === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>
                )}

                <form onSubmit={mode === 'login' ? handleLogin : mode === 'forgot-password' ? handleForgotPassword : handleSignup} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-medium text-on-surface-variant mb-2">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                        <input
                          type="text"
                          placeholder="Dr. John Smith"
                          value={form.fullName}
                          onChange={e => updateForm('fullName', e.target.value)}
                          className="input-field pl-10"
                          required={mode === 'signup'}
                        />
                      </div>
                    </div>
                  )}

                  {(!resetEmailSent || mode !== 'forgot-password') && (
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={e => updateForm('email', e.target.value)}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>
                  )}

                  {mode !== 'forgot-password' && (
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                        value={form.password}
                        onChange={e => updateForm('password', e.target.value)}
                        className="input-field pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {mode === 'login' && (
                      <div className="text-right mt-1">
                        <button type="button" onClick={() => setMode('forgot-password')} className="text-xs text-primary hover:underline">Forgot password?</button>
                      </div>
                    )}
                  </div>
                  )}

                  {mode === 'forgot-password' && resetEmailSent ? (
                    <button
                      type="button"
                      onClick={() => handleForgotPassword()}
                      disabled={loading || resendCountdown > 0}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : resendCountdown > 0 ? (
                        `Resend Email (${resendCountdown}s)`
                      ) : (
                        'Resend Email'
                      )}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : mode === 'login' ? (
                        'Sign In'
                      ) : mode === 'forgot-password' ? (
                        'Send Reset Link'
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  )}

                  {(mode === 'login' || mode === 'signup') && (
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-surface-container dark:border-dark-surface"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-background dark:bg-dark-background text-on-surface-variant">
                            OR
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 border border-surface-container dark:border-dark-surface rounded-xl bg-white dark:bg-dark-card text-on-surface dark:text-white font-medium hover:bg-surface-container dark:hover:bg-dark-surface transition-colors"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                      </button>
                    </div>
                  )}
                </form>

                <p className="text-center text-on-surface-variant text-sm mt-6">
                  {mode === 'forgot-password' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setResetEmailSent(false);
                      }}
                      className="text-primary font-medium hover:underline"
                    >
                      Back to Sign In
                    </button>
                  ) : (
                    <>
                      {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                      <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-primary font-medium hover:underline"
                      >
                        {mode === 'login' ? 'Sign up free' : 'Sign in'}
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <AuthForm />
    </Suspense>
  );
}
