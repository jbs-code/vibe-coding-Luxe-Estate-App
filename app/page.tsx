'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { HeroSearch } from '@/components/home/HeroSearch';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { MarketSection } from '@/components/home/MarketSection';
import {
  FEATURED_PROPERTIES,
  INITIAL_MARKET_PROPERTIES,
  ADDITIONAL_MARKET_PROPERTIES,
} from '@/data/mock-properties';
import { Property, PropertyCategory, PropertyStatusFilter } from '@/types/property';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>('all');
  const [statusFilter, setStatusFilter] = useState<PropertyStatusFilter>('all');
  const [activeNavTab, setActiveNavTab] = useState('Buy');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // State for all properties to allow favorites toggling & dynamic loading
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>(FEATURED_PROPERTIES);
  const [marketProperties, setMarketProperties] = useState<Property[]>(INITIAL_MARKET_PROPERTIES);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Toggle favorite property
  const handleToggleFavorite = (id: string) => {
    setFeaturedProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    setMarketProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Handle Load More
  const handleLoadMore = () => {
    if (!hasLoadedMore) {
      setMarketProperties((prev) => [...prev, ...ADDITIONAL_MARKET_PROPERTIES]);
      setHasLoadedMore(true);
    }
  };

  // Handle Nav Tab change
  const handleNavTabChange = (tab: string) => {
    setActiveNavTab(tab);
    if (tab === 'Buy') {
      setStatusFilter('sale');
    } else if (tab === 'Rent') {
      setStatusFilter('rent');
    } else if (tab === 'Saved Homes') {
      // Show all with active filter
    }
  };

  // Filtered Featured Properties
  const filteredFeatured = useMemo(() => {
    return featuredProperties.filter((property) => {
      // Category filter
      if (selectedCategory !== 'all' && property.type !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesAddress = property.address.toLowerCase().includes(query);
        const matchesType = property.type.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesAddress && !matchesType) {
          return false;
        }
      }
      // Saved Homes Nav filter
      if (activeNavTab === 'Saved Homes' && !property.isFavorite) {
        return false;
      }
      return true;
    });
  }, [featuredProperties, selectedCategory, searchQuery, activeNavTab]);

  // Filtered Market Properties
  const filteredMarket = useMemo(() => {
    return marketProperties.filter((property) => {
      // Status filter (Buy/Sale, Rent, All)
      if (statusFilter !== 'all' && property.status !== statusFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && property.type !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesAddress = property.address.toLowerCase().includes(query);
        const matchesType = property.type.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesAddress && !matchesType) {
          return false;
        }
      }
      // Saved Homes Nav filter
      if (activeNavTab === 'Saved Homes' && !property.isFavorite) {
        return false;
      }
      return true;
    });
  }, [marketProperties, statusFilter, selectedCategory, searchQuery, activeNavTab]);

  const handleSearchFocus = () => {
    const input = document.getElementById('property-search-input');
    input?.focus();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeNavTab}
        onTabChange={handleNavTabChange}
        onSearchClick={handleSearchFocus}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-grow">
        {/* Hero & Search Section */}
        <HeroSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onToggleFiltersModal={() => setIsFiltersOpen(!isFiltersOpen)}
        />

        {/* Filters Quick Dropdown (when toggled) */}
        {isFiltersOpen && (
          <div className="max-w-2xl mx-auto -mt-4 mb-10 p-4 bg-white dark:bg-white/5 rounded-2xl shadow-soft border border-nordic-dark/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-nordic-dark dark:text-white">Filter by Status:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark'
                    : 'bg-clear-day text-nordic-muted hover:text-nordic-dark dark:bg-white/10 dark:text-hint-of-green/70 dark:hover:text-hint-of-green'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('sale')}
                className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                  statusFilter === 'sale'
                    ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark'
                    : 'bg-clear-day text-nordic-muted hover:text-nordic-dark dark:bg-white/10 dark:text-hint-of-green/70 dark:hover:text-hint-of-green'
                }`}
              >
                Buy (For Sale)
              </button>
              <button
                onClick={() => setStatusFilter('rent')}
                className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                  statusFilter === 'rent'
                    ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark'
                    : 'bg-clear-day text-nordic-muted hover:text-nordic-dark dark:bg-white/10 dark:text-hint-of-green/70 dark:hover:text-hint-of-green'
                }`}
              >
                Rent (For Rent)
              </button>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-medium text-mosque dark:text-hint-of-green hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Featured Collections Section */}
        {activeNavTab !== 'Rent' && (
          <FeaturedSection
            properties={filteredFeatured}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* New in Market Section */}
        <MarketSection
          properties={filteredMarket}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onToggleFavorite={handleToggleFavorite}
          onLoadMore={handleLoadMore}
          hasMore={!hasLoadedMore}
        />
      </main>
    </div>
  );
}
