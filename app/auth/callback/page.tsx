'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let active = true;

    const handleAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        } else {
          // In hash-based flow or existing session, refresh session
          await supabase.auth.getSession();
        }
      } catch (err) {
        console.error('Error during auth callback exchange:', err);
      } finally {
        if (active) {
          const returnUrl = searchParams.get('returnUrl') || '/';
          router.replace(returnUrl);
        }
      }
    };

    handleAuthCallback();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-mosque flex items-center justify-center animate-pulse text-white shadow-lg">
          <span className="material-icons text-2xl">apartment</span>
        </div>
        <div className="w-8 h-8 border-3 border-mosque/30 border-t-mosque rounded-full animate-spin"></div>
        <p className="text-nordic-dark/70 dark:text-gray-300 text-sm font-medium">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <div className="w-8 h-8 border-3 border-mosque/30 border-t-mosque rounded-full animate-spin"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
