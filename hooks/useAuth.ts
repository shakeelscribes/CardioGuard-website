'use client';
// hooks/useAuth.ts - Authentication hook
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      setProfile(data);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async function signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  async function updatePassword(password: string) {
    return await supabase.auth.updateUser({ password });
  }

  async function verifyOtp(email: string, token: string, type: 'signup' | 'recovery') {
    return await supabase.auth.verifyOtp({ email, token, type });
  }

  async function resetPasswordForEmail(email: string) {
    return await supabase.auth.resetPasswordForEmail(email);
  }

  async function uploadAvatar(file: File) {
    if (!user) throw new Error('Not authenticated');
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await updateProfile({ avatar_url: data.publicUrl });
    return data.publicUrl;
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!user) return { error: new Error('Not authenticated') };

    // Use .update() not .upsert() — upsert nulls out unspecified fields
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }
    return { data, error };
  }

  async function signInWithGoogle() {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined
      }
    });
  }

  return { 
    user, 
    profile, 
    loading, 
    signOut, 
    signIn, 
    signUp, 
    signInWithGoogle,
    updatePassword, 
    verifyOtp,
    resetPasswordForEmail,
    uploadAvatar, 
    updateProfile, 
    refetchProfile: () => user && fetchProfile(user.id) 
  };
}
