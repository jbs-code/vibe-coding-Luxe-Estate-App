/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { Property } from '@/types/property';

interface FeaturedCardProps {
  property: Property;
  onToggleFavorite?: (id: string) => void;
  onClick?: (property: Property) => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  property,
  onToggleFavorite,
  onClick,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    }
  };

  return (
    <div
      onClick={() => onClick?.(property)}
      className="group relative rounded-xl overflow-hidden shadow-soft bg-white dark:bg-white/5 border border-transparent dark:border-white/10 cursor-pointer transition-all duration-300 hover:shadow-xl"
    >
      <div className="aspect-[4/3] w-full overflow-hidden relative">
        <img
          alt={property.imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={property.imageUrl}
          loading="lazy"
        />

        {/* Tag / Badge */}
        {property.tag && (
          <div className="absolute top-4 left-4 bg-hint-of-green/95 dark:bg-hint-of-green text-nordic-dark backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
            {property.tag}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={property.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer shadow-sm ${
            property.isFavorite
              ? 'text-red-500 hover:bg-red-50'
              : 'text-nordic-dark dark:text-hint-of-green hover:bg-mosque dark:hover:bg-hint-of-green hover:text-white dark:hover:text-nordic-dark'
          }`}
        >
          <span className="material-icons text-xl">
            {property.isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Gradient overlay */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
      </div>

      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2 gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-medium text-nordic-dark dark:text-white group-hover:text-mosque dark:group-hover:text-hint-of-green transition-colors truncate">
              {property.title}
            </h3>
            <p className="text-nordic-muted dark:text-hint-of-green/70 text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm flex-shrink-0">place</span>
              <span className="truncate">{property.location || property.address}</span>
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque dark:text-hint-of-green whitespace-nowrap flex-shrink-0">
            {property.priceFormatted}
            {property.pricePeriod && (
              <span className="text-sm font-normal text-nordic-muted dark:text-hint-of-green/70">
                {property.pricePeriod}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-nordic-dark/5 dark:border-white/10">
          <div className="flex items-center gap-2 text-nordic-muted dark:text-hint-of-green/80 text-sm">
            <span className="material-icons text-lg text-mosque/80 dark:text-hint-of-green">king_bed</span>
            <span>{property.beds} Beds</span>
          </div>
          <div className="flex items-center gap-2 text-nordic-muted dark:text-hint-of-green/80 text-sm">
            <span className="material-icons text-lg text-mosque/80 dark:text-hint-of-green">bathtub</span>
            <span>{property.baths} Baths</span>
          </div>
          <div className="flex items-center gap-2 text-nordic-muted dark:text-hint-of-green/80 text-sm">
            <span className="material-icons text-lg text-mosque/80 dark:text-hint-of-green">square_foot</span>
            <span>{property.area}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
