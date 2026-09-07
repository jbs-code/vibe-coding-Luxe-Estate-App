import React from 'react';
import { Navbar } from '@/components/shared/Navbar';

export default function PropertyDetailsLoading() {
  return (
    <div className="min-h-screen bg-clear-day dark:bg-background-dark text-nordic dark:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Gallery Skeleton */}
          <div className="lg:col-span-8 space-y-4">
            <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
            <div className="flex gap-4 overflow-hidden pb-2">
              <div className="w-44 aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-lg flex-shrink-0"></div>
              <div className="w-44 aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-lg flex-shrink-0"></div>
              <div className="w-44 aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-lg flex-shrink-0"></div>
            </div>
          </div>

          {/* Sticky Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-white/5 p-6 rounded-xl border border-mosque/5 dark:border-white/10 space-y-4">
              <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-px bg-slate-100 dark:bg-white/10 my-4"></div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-full mt-4"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
            </div>

            <div className="bg-white dark:bg-white/5 p-2 rounded-xl border border-mosque/5 dark:border-white/10">
              <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          </div>

          {/* Left Details Skeleton */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            <div className="bg-white dark:bg-white/5 p-8 rounded-xl border border-mosque/5 dark:border-white/10">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-slate-100 dark:bg-white/5 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 p-8 rounded-xl border border-mosque/5 dark:border-white/10 space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
