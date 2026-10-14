'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPropertiesActive = pathname.startsWith('/admin/properties');
  const isUsersActive = pathname.startsWith('/admin/users');

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-[#152e2a] border-b border-nordic/5 dark:border-primary/20 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Primary Navigation */}
          <div className="flex items-center gap-8 md:gap-12">
            <Link href="/admin/properties" className="flex items-center gap-2 group cursor-pointer">
              {/* <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-xl">LuxeEstate</span>
              </div> */}
              <span className="font-bold text-lg text-nordic dark:text-white tracking-tight">
                LuxeEstate
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-hint-green">
                Admin
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/admin/properties"
                className={`px-1 py-2 text-sm font-medium transition-colors border-b-2 ${isPropertiesActive
                  ? 'text-primary dark:text-hint-green border-primary dark:border-hint-green font-semibold'
                  : 'text-nordic/60 dark:text-gray-400 hover:text-primary dark:hover:text-white border-transparent'
                  }`}
              >
                Properties
              </Link>
              <Link
                href="/admin/users"
                className={`px-1 py-2 text-sm font-medium transition-colors border-b-2 ${isUsersActive
                  ? 'text-primary dark:text-hint-green border-primary dark:border-hint-green font-semibold'
                  : 'text-nordic/60 dark:text-gray-400 hover:text-primary dark:hover:text-white border-transparent'
                  }`}
              >
                Users
              </Link>
              <Link
                href="/"
                className="text-nordic/50 dark:text-gray-400 hover:text-primary dark:hover:text-white px-1 py-2 text-sm font-medium transition-colors flex items-center gap-1 border-b-2 border-transparent"
              >
                <span>Sitio Web</span>
              </Link>
            </div>
          </div>

          {/* Secondary Actions / User Profile */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Notifications */}
            <button
              type="button"
              className="text-nordic/60 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors relative p-1.5 rounded-full hover:bg-nordic/5 dark:hover:bg-white/5 cursor-pointer"
              title="Notificaciones"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#152e2a]"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-nordic/10 dark:border-gray-700 cursor-pointer group"
              >
                <div className="hidden sm:flex flex-col items-end text-right">
                  <span className="text-sm font-semibold text-nordic dark:text-white line-clamp-1">
                    {displayName || user?.email?.split('@')[0] || 'Administrador'}
                  </span>
                  <span className="text-[11px] font-medium text-primary dark:text-hint-green">
                    Admin
                  </span>
                </div>

                <div className="h-9 w-9 rounded-full bg-primary/10 overflow-hidden ring-2 ring-white dark:ring-primary/20 flex items-center justify-center flex-shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName || 'Admin'}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                  )}
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#152e2a] shadow-dropdown border border-nordic/10 dark:border-primary/20 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-nordic/5 dark:border-white/10">
                    <p className="text-xs font-semibold text-nordic dark:text-white truncate">
                      {displayName || 'Administrador'}
                    </p>
                    <p className="text-[11px] text-nordic/60 dark:text-gray-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    href="/admin/properties"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-nordic dark:text-gray-200 hover:bg-nordic/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">apartment</span>
                    Properties
                  </Link>

                  <Link
                    href="/admin/users"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-nordic dark:text-gray-200 hover:bg-nordic/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base text-primary">group</span>
                    Users Directory
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-nordic dark:text-gray-200 hover:bg-nordic/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">home</span>
                    Volver al sitio
                  </Link>

                  <div className="border-t border-nordic/5 dark:border-white/10 my-1"></div>

                  <button
                    type="button"
                    onClick={async () => {
                      setUserDropdownOpen(false);
                      await signOut();
                      router.push('/');
                      router.refresh();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-nordic/60 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-nordic/5 dark:hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-nordic/5 dark:border-primary/20 py-3 space-y-1">
            <Link
              href="/admin/properties"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isPropertiesActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-nordic/70 dark:text-gray-300'
                }`}
            >
              Properties
            </Link>
            <Link
              href="/admin/users"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${isUsersActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-nordic/70 dark:text-gray-300'
                }`}
            >
              Users
            </Link>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-nordic/70 dark:text-gray-300"
            >
              Volver al sitio
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
