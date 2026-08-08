'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import { useAuth } from '@/hooks/useAuth';
import { User, ShieldCheck, Loader2, Camera, Lock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, updateProfile, uploadAvatar, loading: authLoading } = useAuth();
  const container = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (profile) {
      setFormData({
        name: profile.name || '',
        dob: profile.dob || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || 'Male',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || ''
      });
    }
  }, [authLoading, user, profile, router]);

  useGSAP(() => {
    if (authLoading) return;
    
    gsap.from('.profile-header', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' });
    gsap.from('.profile-card', { opacity: 0, y: 30, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 0.2 });
    
    gsap.to('.ambient-glow', {
      opacity: 0.6,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }, { scope: container, dependencies: [authLoading] });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Avatar file size must be less than 5MB');
        return;
      }
      
      setAvatarLoading(true);
      await uploadAvatar(file);
      toast.success('Visual identifier updated successfully');
    } catch (error: any) {
      toast.error('Failed to update avatar: ' + error.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let calculatedAge = parseInt(formData.age);
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      calculatedAge = age;
    }
    
    try {
      await updateProfile({
        name: formData.name,
        dob: formData.dob || null,
        age: calculatedAge,
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      });
      toast.success('Biometric profile synchronized successfully');
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnifiedLayout>
      {authLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-primary">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <span className="font-mono text-xs tracking-widest uppercase font-bold">Verifying Credentials...</span>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto pb-12 relative" ref={container}>
          
          {/* Ambient Background Glows */}
          <div className="ambient-glow absolute top-10 left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="ambient-glow absolute bottom-10 right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

          <div className="profile-header border-b border-border/50 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>

              <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground">
                Entity <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Profile</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground font-sans">
                Manage Biometric Identity & Security protocols
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-mono text-[10px] tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(var(--primary),0.1)] border border-primary/20">
              <ShieldCheck className="w-4 h-4" />
              End-to-End Encrypted
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Avatar Section */}
            <div className="md:col-span-1 space-y-6">
              <Card className="profile-card rounded-[2rem] border border-border/50 shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                  <div className="relative group mb-8 mt-4">
                    {/* Scanning Ring Effect */}
                    <div className="absolute -inset-4 rounded-full border border-primary/20 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-500" />
                    <div className="absolute -inset-2 rounded-full border-2 border-primary/10 border-t-primary/60 animate-spin-slow" />
                    
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-background shadow-[0_0_30px_rgba(var(--primary),0.15)] bg-muted/50 flex items-center justify-center relative z-10">
                      {avatarLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      ) : profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center backdrop-blur-sm cursor-pointer">
                      <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center">
                        <Camera className="w-6 h-6 text-white mb-2" />
                        <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">Update</span>
                      </label>
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={avatarLoading}
                    />
                  </div>
                  
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2">{profile?.name || 'Unknown Entity'}</h3>
                  <p className="text-muted-foreground font-mono text-[10px] lowercase tracking-widest">{user?.email}</p>
                </CardContent>
              </Card>

              <Card className="profile-card rounded-[2rem] border border-border/50 shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden">
                <CardContent className="p-6">
                  <Link href="/update-password">
                    <Button variant="outline" className="w-full rounded-2xl h-14 gap-3 font-mono text-xs uppercase tracking-widest font-bold border-primary/20 hover:bg-primary/10 hover:text-primary transition-all hover:scale-[1.02] shadow-[0_0_15px_rgba(var(--primary),0.05)]">
                      <Lock className="w-4 h-4" />
                      Update Password
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Form Section */}
            <div className="md:col-span-2">
              <Card className="profile-card rounded-[2rem] border border-border/50 shadow-2xl bg-card/60 backdrop-blur-3xl overflow-hidden relative">
                <div className="h-1 w-full bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                
                <CardContent className="p-8 md:p-12 relative z-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-heading font-bold text-foreground tracking-tight">Baseline Metrics</h2>
                      </div>
                      
                      <div className="space-y-3">
                        <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Entity Designation (Full Name)</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="h-16 rounded-2xl bg-muted/30 border-transparent hover:bg-muted/50 focus-visible:bg-background focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg shadow-inner px-6"
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Date of Birth</Label>
                          <Input
                            type="date"
                            value={formData.dob}
                            onChange={(e) => setFormData({...formData, dob: e.target.value})}
                            className="h-16 rounded-2xl bg-muted/30 border-transparent hover:bg-muted/50 focus-visible:bg-background focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg shadow-inner px-6 [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Biological Classification</Label>
                          <RadioGroup 
                            value={formData.gender} 
                            onValueChange={(val) => setFormData({...formData, gender: val})}
                            className="flex gap-4 h-16"
                          >
                            <Label className={`flex-1 flex items-center justify-center rounded-2xl border border-transparent cursor-pointer transition-all ${formData.gender === 'Male' ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}>
                              <RadioGroupItem value="Male" className="sr-only" />
                              <span className="font-heading font-bold text-lg">Male</span>
                            </Label>
                            <Label className={`flex-1 flex items-center justify-center rounded-2xl border border-transparent cursor-pointer transition-all ${formData.gender === 'Female' ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]' : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}`}>
                              <RadioGroupItem value="Female" className="sr-only" />
                              <span className="font-heading font-bold text-lg">Female</span>
                            </Label>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Height Baseline (cm)</Label>
                          <Input
                            type="number"
                            value={formData.height}
                            onChange={(e) => setFormData({...formData, height: e.target.value})}
                            className="h-16 rounded-2xl bg-muted/30 border-transparent hover:bg-muted/50 focus-visible:bg-background focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg shadow-inner px-6"
                            placeholder="175"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Weight Baseline (kg)</Label>
                          <Input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({...formData, weight: e.target.value})}
                            className="h-16 rounded-2xl bg-muted/30 border-transparent hover:bg-muted/50 focus-visible:bg-background focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-lg shadow-inner px-6"
                            placeholder="70"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl gap-3 font-mono text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:-translate-y-0.5 transition-all group relative overflow-hidden">
                        {loading ? (
                          <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Synchronizing...</>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            Synchronize Data
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      )}
    </UnifiedLayout>
  );
}
