'use client';

import React from 'react';
import { Property } from '@/types/property';
import { FeaturedCard } from '@/components/shared/FeaturedCard';

interface FeaturedSectionProps {
  properties: Property[];
  onToggleFavorite?: (id: string) => void;
  onViewAllClick?: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  properties,
  onToggleFavorite,
  onViewAllClick,
}) => {
  if (properties.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white">
            Featured Collections
          </h2>
          <p className="text-nordic-muted dark:text-hint-of-green/70 mt-1 text-sm">
            Curated properties for the discerning eye.
          </p>
        </div>
        <button
          onClick={onViewAllClick}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque dark:text-hint-of-green hover:opacity-70 transition-opacity cursor-pointer"
        >
          View all <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {properties.map((property) => (
          <FeaturedCard
            key={property.id}
            property={property}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </section>
  );
};
