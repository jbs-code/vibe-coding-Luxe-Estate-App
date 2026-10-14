'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session, Provider } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  role: UserRole | null;
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
  const [role, setRole] = useState<UserRole | null>(null);

  const fetchRole = useCallback(async (userId: string) => {
    try {
      // 1. Check if user already has a role in the database
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data?.role) {
        setRole(data.role as UserRole);
        return;
      }

      // 2. If no role is registered yet, assign the default role in the database
      const { data: assignedRole, error: rpcError } = await supabase.rpc('get_or_create_user_role');
      if (!rpcError && assignedRole) {
        setRole(assignedRole as UserRole);
        return;
      }

      // Fallback: direct insert with default 'user' role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'user' });

      if (!insertError) {
        setRole('user');
      } else {
        setRole('user');
      }
    } catch (err) {
      console.error('[AuthContext] Error getting/assigning role:', err);
      setRole('user');
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (mounted) {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsLoading(false);
        if (initialSession?.user) {
          fetchRole(initialSession.user.id);
        }
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
        if (newSession?.user) {
          fetchRole(newSession.user.id);
        } else {
          setRole(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole]);

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
      role,
      avatarUrl,
      displayName,
      email,
      provider,
      signInWithGoogle,
      signInWithGitHub,
      signOut,
    }),
    [user, session, isLoading, role, avatarUrl, displayName, email, provider, signInWithGoogle, signInWithGitHub, signOut]
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
