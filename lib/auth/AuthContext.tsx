'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  avatarUrl: string | null;
  displayName: string;
  email: string | null;
  provider: string | null;
  signInWithGoogle: (returnUrl?: string) => Promise<{ error: Error | null }>;
  signInWithGitHub: (returnUrl?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (mounted) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsLoading(false);
      }
    }).catch(() => {
      if (mounted) {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const avatarUrl = useMemo(() => {
    if (!user) return null;
    const meta = user.user_metadata || {};
    return (
      meta.avatar_url ||
      meta.picture ||
      meta.avatar ||
      null
    );
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return '';
    const meta = user.user_metadata || {};
    return (
      meta.full_name ||
      meta.name ||
      meta.user_name ||
      user.email?.split('@')[0] ||
      'User'
    );
  }, [user]);

  const email = useMemo(() => {
    return user?.email || user?.user_metadata?.email || null;
  }, [user]);

  const provider = useMemo(() => {
    if (!user) return null;
    return (
      user.app_metadata?.provider ||
      user.identities?.[0]?.provider ||
      null
    );
  }, [user]);

  const signInWithOAuthProvider = useCallback(
    async (oauthProvider: Provider, returnUrl?: string) => {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const redirectTo = returnUrl
          ? `${origin}/auth/callback?returnUrl=${encodeURIComponent(returnUrl)}`
          : `${origin}/auth/callback`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: oauthProvider,
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          return { error };
        }
        return { error: null };
      } catch (err: unknown) {
        return { error: err instanceof Error ? err : new Error('Unknown error during sign in') };
      }
    },
    []
  );

  const signInWithGoogle = useCallback(
    (returnUrl?: string) => signInWithOAuthProvider('google', returnUrl),
    [signInWithOAuthProvider]
  );

  const signInWithGitHub = useCallback(
    (returnUrl?: string) => signInWithOAuthProvider('github', returnUrl),
    [signInWithOAuthProvider]
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setSession(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      isLoading,
      avatarUrl,
      displayName,
      email,
      provider,
      signInWithGoogle,
      signInWithGitHub,
      signOut,
    }),
    [user, session, isLoading, avatarUrl, displayName, email, provider, signInWithGoogle, signInWithGitHub, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
