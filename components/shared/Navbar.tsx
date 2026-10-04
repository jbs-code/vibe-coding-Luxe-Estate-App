/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale, SUPPORTED_LOCALES } from '@/lib/i18n/config';
import { useAuth } from '@/lib/auth';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'buy',
  onTabChange,
  onSearchClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeNavKey, setActiveNavKey] = useState(activeTab.toLowerCase());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { locale, setLocale, t, locales, currentLocaleMeta } = useLanguage();
  const { user, isLoading: authLoading, avatarUrl, displayName, email, provider, signOut } = useAuth();

  const navLinks = [
    { key: 'buy', label: t.nav.buy, href: '#' },
    { key: 'rent', label: t.nav.rent, href: '#' },
    { key: 'sell', label: t.nav.sell, href: '#' },
    { key: 'saved', label: t.nav.savedHomes, href: '#' },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    if (langDropdownOpen || userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen, userDropdownOpen]);

  const handleNavClick = (key: string, label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNavKey(key);
    if (onTabChange) {
      onTabChange(label);
    }
    setMobileMenuOpen(false);
  };

  const handleLocaleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setLangDropdownOpen(false);
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-nordic-dark/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-nordic-dark dark:bg-hint-of-green/15 flex items-center justify-center group-hover:bg-mosque dark:group-hover:bg-hint-of-green/30 transition-colors">
              <span className="material-icons text-white dark:text-hint-of-green text-lg">apartment</span>
            </div>
            <span className="text-xl font-semibold tracking-tight text-nordic-dark dark:text-white">
              {t.common.brandName}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeNavKey === link.key;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.key, link.label, e)}
                  className={`font-medium text-sm px-1 py-1 transition-all ${
                    isActive
                      ? 'text-mosque border-b-2 border-mosque dark:text-hint-of-green dark:border-hint-of-green'
                      : 'text-nordic-dark/70 hover:text-nordic-dark hover:border-b-2 hover:border-nordic-dark/20 dark:text-hint-of-green/70 dark:hover:text-hint-of-green dark:hover:border-b-2 dark:hover:border-hint-of-green/40'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Right Action Icons, Language Selector & Auth */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Selector Dropdown (Desktop & Tablet) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-label={t.nav.selectLanguage}
                aria-expanded={langDropdownOpen}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-nordic-dark/10 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-nordic-dark dark:text-white text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
              >
                <span className="text-sm" role="img" aria-hidden="true">
                  {currentLocaleMeta.flag}
                </span>
                <span className="uppercase">{currentLocaleMeta.code}</span>
                <span className="material-icons text-xs text-nordic-dark/50 dark:text-white/50 transition-transform duration-200">
                  {langDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-nordic-dark/10 dark:border-white/10 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-nordic-muted dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 mb-1">
                    {t.nav.language}
                  </div>
                  {SUPPORTED_LOCALES.map((loc) => {
                    const meta = locales[loc];
                    const isSelected = locale === loc;
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleLocaleSelect(loc)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-mosque/10 dark:bg-hint-of-green/15 text-mosque dark:text-hint-of-green font-semibold'
                            : 'text-nordic-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{meta.flag}</span>
                          <span>{meta.nativeLabel}</span>
                        </div>
                        {isSelected && (
                          <span className="material-icons text-sm text-mosque dark:text-hint-of-green">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={onSearchClick}
              aria-label={t.common.searchProperties}
              className="text-nordic-dark hover:text-mosque dark:text-hint-of-green/80 dark:hover:text-hint-of-green transition-colors cursor-pointer p-1"
            >
              <span className="material-icons text-xl">search</span>
            </button>

            {/* Notifications Button */}
            <button
              aria-label={t.common.notifications}
              className="text-nordic-dark hover:text-mosque dark:text-hint-of-green/80 dark:hover:text-hint-of-green transition-colors relative cursor-pointer p-1"
            >
              <span className="material-icons text-xl">notifications_none</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark" />
            </button>

            {/* Authentication / Profile Section */}
            {authLoading ? (
              <div className="w-9 h-9 rounded-full bg-nordic-dark/10 dark:bg-white/10 animate-pulse ml-1" />
            ) : user ? (
              /* Logged In User Avatar & Dropdown */
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label={t.common.userProfile}
                  aria-expanded={userDropdownOpen}
                  className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 ml-1 cursor-pointer group"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-mosque/15 dark:bg-hint-of-green/20 overflow-hidden ring-2 ring-transparent group-hover:ring-mosque dark:group-hover:ring-hint-of-green transition-all flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        alt={displayName || 'Profile'}
                        className="w-full h-full object-cover"
                        src={avatarUrl}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-xs font-bold text-mosque dark:text-hint-of-green uppercase">
                        {(displayName || email || 'U').charAt(0)}
                      </span>
                    )}
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-nordic-dark/10 dark:border-white/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User info Header */}
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-nordic-dark dark:text-white truncate">
                          {displayName}
                        </span>
                        {provider && (
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-nordic-muted dark:text-gray-300">
                            {provider}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-nordic-muted dark:text-gray-400 truncate">
                        {email}
                      </p>
                    </div>

                    {/* Quick links */}
                    <div className="py-1">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setUserDropdownOpen(false);
                          if (onTabChange) onTabChange(t.nav.savedHomes);
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-nordic-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="material-icons text-base text-mosque dark:text-hint-of-green">
                          favorite_border
                        </span>
                        <span>{t.nav.savedHomes}</span>
                      </a>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      >
                        <span className="material-icons text-base">logout</span>
                        <span>{t.auth.signOut}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Logged Out - Sign In Button */
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-mosque hover:bg-nordic-dark text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow cursor-pointer ml-1"
              >
                <span className="material-icons text-sm">login</span>
                <span>{t.auth.signIn}</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={t.nav.toggleMobileMenu}
              className="md:hidden text-nordic-dark hover:text-mosque dark:text-hint-of-green/80 dark:hover:text-hint-of-green transition-colors ml-1 cursor-pointer p-1"
            >
              <span className="material-icons text-2xl">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden border-t border-nordic-dark/5 dark:border-white/10 bg-background-light dark:bg-background-dark overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-[32rem] py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeNavKey === link.key;
            return (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleNavClick(link.key, link.label, e)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-mosque bg-mosque/10 dark:text-hint-of-green dark:bg-hint-of-green/10 font-semibold'
                    : 'text-nordic-dark hover:bg-black/5 dark:text-hint-of-green/80 dark:hover:text-hint-of-green dark:hover:bg-hint-of-green/10'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          {/* Mobile User Profile / Login Row */}
          <div className="pt-3 mt-3 border-t border-nordic-dark/10 dark:border-white/10 px-3">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-mosque/15 dark:bg-hint-of-green/20 overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        alt={displayName}
                        className="w-full h-full object-cover"
                        src={avatarUrl}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-sm font-bold text-mosque dark:text-hint-of-green uppercase">
                        {(displayName || email || 'U').charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-nordic-dark dark:text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-nordic-muted dark:text-gray-400 truncate">
                      {email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold cursor-pointer"
                >
                  <span className="material-icons text-sm">logout</span>
                  <span>{t.auth.signOut}</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-mosque text-white text-sm font-semibold tracking-wide shadow-sm"
              >
                <span className="material-icons text-base">login</span>
                <span>{t.auth.signIn}</span>
              </Link>
            )}
          </div>

          {/* Mobile Language Switcher Row */}
          <div className="pt-3 mt-3 border-t border-nordic-dark/10 dark:border-white/10 flex items-center justify-between px-3">
            <span className="text-xs font-semibold text-nordic-muted dark:text-gray-400 uppercase tracking-wider">
              {t.nav.language}
            </span>
            <div className="flex items-center gap-1.5">
              {SUPPORTED_LOCALES.map((loc) => {
                const meta = locales[loc];
                const isSelected = locale === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => handleLocaleSelect(loc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-mosque text-white dark:bg-hint-of-green dark:text-nordic shadow-sm'
                        : 'bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 text-nordic-dark dark:text-white'
                    }`}
                  >
                    <span>{meta.flag}</span>
                    <span>{meta.code.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
