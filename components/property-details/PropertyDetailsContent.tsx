'use client';

import React from 'react';
import { Property } from '@/types/property';
import { MortgageCalculator } from './MortgageCalculator';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PropertyDetailsContentProps {
  property: Property;
}

export const PropertyDetailsContent: React.FC<PropertyDetailsContentProps> = ({ property }) => {
  const { t, getLocalizedAmenity, interpolate } = useLanguage();

  const defaultAmenities = [
    'Smart Home System',
    'Swimming Pool',
    'Central Heating & Cooling',
    'Electric Vehicle Charging',
    'Private Gym',
    'Wine Cellar',
  ];

  const amenitiesList =
    property.amenities && property.amenities.length > 0
      ? property.amenities
      : defaultAmenities;

  return (
    <>
      <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
        {/* Property Features Card */}
        <section
          aria-label={t.propertyDetails.featuresTitle}
          className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10"
        >
          <h2 className="text-lg font-semibold mb-6 text-nordic dark:text-white">
            {t.propertyDetails.featuresTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
              <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                square_foot
              </span>
              <span className="text-xl font-bold text-nordic dark:text-white">
                {property.area.replace(/[^0-9,]/g, '') || '240'}
              </span>
              <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60 text-center">
                {t.propertyDetails.squareMeters}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
              <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                bed
              </span>
              <span className="text-xl font-bold text-nordic dark:text-white">
                {property.beds}
              </span>
              <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60 text-center">
                {t.propertyDetails.bedrooms}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
              <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                shower
              </span>
              <span className="text-xl font-bold text-nordic dark:text-white">
                {property.baths}
              </span>
              <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60 text-center">
                {t.propertyDetails.bathrooms}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
              <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                directions_car
              </span>
              <span className="text-xl font-bold text-nordic dark:text-white">
                {property.garage ?? 2}
              </span>
              <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60 text-center">
                {t.propertyDetails.garage}
              </span>
            </div>
          </div>
        </section>

        {/* About This Home Card */}
        <section
          aria-label={t.propertyDetails.aboutThisHome}
          className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10"
        >
          <h2 className="text-lg font-semibold mb-4 text-nordic dark:text-white">
            {t.propertyDetails.aboutThisHome}
          </h2>
          <div className="prose prose-slate max-w-none text-nordic/70 dark:text-white/80 leading-relaxed space-y-4">
            {property.description ? (
              property.description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <>
                <p>
                  Experience modern luxury in this architecturally stunning home located in the heart of {property.location}. Designed with an emphasis on indoor-outdoor living, the residence features floor-to-ceiling glass walls that flood the interiors with natural light.
                </p>
                <p>
                  The open-concept kitchen is equipped with top-of-the-line appliances and custom cabinetry, perfect for culinary enthusiasts. Retreat to the primary suite, a sanctuary of relaxation with a spa-inspired bath and private balcony.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Amenities Card */}
        <section
          aria-label={t.propertyDetails.amenitiesTitle}
          className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10"
        >
          <h2 className="text-lg font-semibold mb-6 text-nordic dark:text-white">
            {t.propertyDetails.amenitiesTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {amenitiesList.map((amenity, idx) => (
              <div
                key={`${amenity}-${idx}`}
                className="flex items-center gap-3 text-nordic/80 dark:text-white/80"
              >
                <span className="material-icons text-mosque/80 dark:text-hint-of-green text-sm">
                  check_circle
                </span>
                <span className="text-sm font-medium">{getLocalizedAmenity(amenity)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Estimated Payment / Mortgage Calculator */}
        <MortgageCalculator price={property.price} />
      </div>

      {/* Localized Footer */}
      <footer className="col-span-1 lg:col-span-12 bg-white dark:bg-black/20 border-t border-slate-200 dark:border-white/10 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic/50 dark:text-white/50">
            {interpolate(t.common.copyright, { year: new Date().getFullYear() })}
          </div>
          <div className="flex gap-6">
            <a
              className="text-nordic/40 hover:text-mosque dark:text-white/40 dark:hover:text-hint-of-green transition-colors"
              href="#"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              className="text-nordic/40 hover:text-mosque dark:text-white/40 dark:hover:text-hint-of-green transition-colors"
              href="#"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};
