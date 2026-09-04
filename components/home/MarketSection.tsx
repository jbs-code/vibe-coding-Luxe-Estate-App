'use client';

import React from 'react';
import { Property, PropertyStatusFilter } from '@/types/property';
import { PropertyCard } from '@/components/shared/PropertyCard';

interface MarketSectionProps {
  properties: Property[];
  statusFilter: PropertyStatusFilter;
  onStatusFilterChange: (status: PropertyStatusFilter) => void;
  onToggleFavorite?: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const STATUS_OPTIONS: { label: string; value: PropertyStatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'sale' },
  { label: 'Rent', value: 'rent' },
];

export const MarketSection: React.FC<MarketSectionProps> = ({
  properties,
  statusFilter,
  onStatusFilterChange,
  onToggleFavorite,
  onLoadMore,
  hasMore = true,
}) => {
  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">
            New in Market
          </h2>
          <p className="text-nordic-muted dark:text-hint-of-green/70 mt-1 text-sm">
            Fresh opportunities added this week.
          </p>
        </div>

        {/* Status Filter Tabs (Buy / Rent / All) */}
        <div className="flex bg-white dark:bg-white/5 p-1 rounded-lg border border-nordic-dark/5 dark:border-white/10">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = statusFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onStatusFilterChange(option.value)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-nordic-dark text-white dark:bg-hint-of-green dark:text-nordic-dark shadow-sm'
                    : 'text-nordic-muted hover:text-nordic-dark dark:text-hint-of-green/70 dark:hover:text-hint-of-green'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 bg-white/50 dark:bg-white/5 rounded-2xl border border-nordic-dark/5 dark:border-white/10">
          <span className="material-icons text-4xl text-nordic-muted dark:text-hint-of-green/60 mb-2">
            search_off
          </span>
          <h3 className="text-lg font-medium text-nordic-dark dark:text-white">
            No properties found
          </h3>
          <p className="text-nordic-muted dark:text-hint-of-green/70 text-sm mt-1">
            Try adjusting your search criteria or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {hasMore && properties.length > 0 && (
        <div className="mt-12 text-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 bg-white dark:bg-white/5 border border-nordic-dark/10 dark:border-white/10 hover:border-mosque hover:text-mosque dark:hover:border-hint-of-green dark:hover:text-hint-of-green text-nordic-dark dark:text-hint-of-green font-medium rounded-lg transition-all hover:shadow-md cursor-pointer"
          >
            Load more properties
          </button>
        </div>
      )}
    </section>
  );
};
