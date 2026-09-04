/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'Buy',
  onTabChange,
  onSearchClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState(activeTab);

  const navLinks = [
    { label: 'Buy', href: '#' },
    { label: 'Rent', href: '#' },
    { label: 'Sell', href: '#' },
    { label: 'Saved Homes', href: '#' },
  ];

  const handleNavClick = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(label);
    if (onTabChange) {
      onTabChange(label);
    }
    setMobileMenuOpen(false);
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
              LuxeEstate
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.label, e)}
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

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={onSearchClick}
              aria-label="Search properties"
              className="text-nordic-dark hover:text-mosque dark:text-hint-of-green/80 dark:hover:text-hint-of-green transition-colors cursor-pointer"
            >
              <span className="material-icons">search</span>
            </button>

            <button
              aria-label="Notifications"
              className="text-nordic-dark hover:text-mosque dark:text-hint-of-green/80 dark:hover:text-hint-of-green transition-colors relative cursor-pointer"
            >
              <span className="material-icons">notifications_none</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark" />
            </button>

            <button
              aria-label="User profile"
              className="flex items-center gap-2 pl-2 border-l border-nordic-dark/10 dark:border-white/10 ml-2 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent hover:ring-mosque dark:hover:ring-hint-of-green transition-all">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAWhQZ663Bd08kmzjbOPmUk4UIxYooNONShMEFXLR-DtmVi6Oz-TiaY77SPwFk7g0OobkeZEOMvt6v29mSOD0Xm2g95WbBG3ZjWXmiABOUwGU0LOySRfVDo-JTXQ0-gtwjWxbmue0qDm91m-zEOEZwAW6iRFB1qC1bAU-wkjxm67Sbztq8w7srHkFT9bVEC86qG-FzhOBTomhAurNRmx9l8Yfqabk328NfdKuVLckgCdaPsNFE3yN65MeoRi05GA_gXIMwG4YDIeA"
                />
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="md:hidden text-nordic-dark hover:text-mosque dark:text-hint-of-green/80 dark:hover:text-hint-of-green transition-colors ml-1 cursor-pointer"
            >
              <span className="material-icons">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <div
        className={`md:hidden border-t border-nordic-dark/5 dark:border-white/10 bg-background-light dark:bg-background-dark overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-64 py-2 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeNav === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(link.label, e)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'text-mosque bg-mosque/10 dark:text-hint-of-green dark:bg-hint-of-green/10'
                    : 'text-nordic-dark hover:bg-black/5 dark:text-hint-of-green/80 dark:hover:text-hint-of-green dark:hover:bg-hint-of-green/10'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
