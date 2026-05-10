'use client';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Heart, Eye, EyeOff, Loader2, Lock, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

function UpdatePasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const requirements = [
    { regex: /.{8,}/, text: 'At least 8 characters' },
    { regex: /[A-Z]/, text: 'At least one uppercase letter' },
    { regex: /[a-z]/, text: 'At least one lowercase letter' },
    { regex: /[0-9]/, text: 'At least one number' },
  ];

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate requirements
    const allReqsMet = requirements.every(req => req.regex.test(form.password));
    if (!allReqsMet) {
      toast.error('Please meet all password requirements');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: form.password,
      });
      if (error) throw error;
      toast.success('Password updated successfully! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
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
            Secure your account.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Update your password to regain access to your heart health dashboard.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background dark:bg-dark-background">
        <div className="w-full max-w-md">
          {/* Back to auth */}
          <Link href="/auth" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary-gradient flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-jakarta font-bold text-lg gradient-text">CardioGuard</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key="update-password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="font-jakarta text-3xl font-bold text-on-surface dark:text-white mb-2">
                Create New Password
              </h1>
              <p className="text-on-surface-variant text-sm mb-8">
                Your new password must be different from previously used passwords.
              </p>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
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

                  {/* Password Requirements Checklist */}
                  <div className="mt-3 space-y-2">
                    {requirements.map((req, i) => {
                      const isMet = req.regex.test(form.password);
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm transition-colors duration-300">
                          {isMet ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-on-surface-variant/50" />
                          )}
                          <span className={isMet ? 'text-emerald-500 font-medium' : 'text-on-surface-variant'}>
                            {req.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={e => updateForm('confirmPassword', e.target.value)}
                      className="input-field pl-10 pr-10"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
