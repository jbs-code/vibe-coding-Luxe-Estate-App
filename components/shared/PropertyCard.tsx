/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PropertyCardProps {
  property: Property;
  onToggleFavorite?: (id: string) => void;
  onClick?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onToggleFavorite,
  onClick,
}) => {
  const { t, getLocalizedStatusBadge, getLocalizedPricePeriod } = useLanguage();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    }
  };

  const isRent = property.status === 'rent';
  const propertyHref = `/propiedades/${property.slug || property.id}`;
  const localizedStatus = getLocalizedStatusBadge(property.status);
  const localizedPeriod = getLocalizedPricePeriod(property.pricePeriod);

  return (
    <Link
      href={propertyHref}
      onClick={() => onClick?.(property)}
      className="bg-white dark:bg-white/5 border border-transparent dark:border-white/10 rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col block"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={property.imageAlt || property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.imageUrl}
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={
            property.isFavorite
              ? t.propertyDetails.removeFromFavorites
              : t.propertyDetails.addToFavorites
          }
          className={`absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/50 rounded-full transition-colors cursor-pointer shadow-sm ${
            property.isFavorite
              ? 'text-red-500 hover:bg-red-50'
              : 'text-nordic-dark dark:text-hint-of-green hover:bg-mosque dark:hover:bg-hint-of-green hover:text-white dark:hover:text-nordic-dark'
          }`}
        >
          <span className="material-icons text-lg">
            {property.isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>

        {/* Status Badge */}
        <div
          className={`absolute bottom-3 left-3 text-xs font-bold px-2 py-1 rounded shadow-sm ${
            isRent
              ? 'bg-mosque/90 text-white dark:bg-hint-of-green dark:text-nordic-dark'
              : 'bg-nordic-dark/90 text-white dark:bg-nordic-dark/95 dark:text-hint-of-green dark:border dark:border-hint-of-green/30'
          }`}
        >
          {localizedStatus}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark dark:text-white">
            {property.priceFormatted}
            {localizedPeriod && (
              <span className="text-sm font-normal text-nordic-muted dark:text-hint-of-green/70">
                {localizedPeriod}
              </span>
            )}
          </h3>
        </div>

        <h4 className="text-nordic-dark dark:text-gray-200 font-medium truncate mb-1 group-hover:text-mosque dark:group-hover:text-hint-of-green transition-colors">
          {property.title}
        </h4>

        <p className="text-nordic-muted dark:text-hint-of-green/70 text-xs mb-4 truncate">
          {property.address}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-1 text-nordic-muted dark:text-hint-of-green/80 text-xs">
            <span className="material-icons text-sm text-mosque/80 dark:text-hint-of-green">king_bed</span>
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center gap-1 text-nordic-muted dark:text-hint-of-green/80 text-xs">
            <span className="material-icons text-sm text-mosque/80 dark:text-hint-of-green">bathtub</span>
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1 text-nordic-muted dark:text-hint-of-green/80 text-xs">
            <span className="material-icons text-sm text-mosque/80 dark:text-hint-of-green">square_foot</span>
            <span>{property.area}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
