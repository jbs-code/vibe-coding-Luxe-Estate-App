import React, { Suspense } from 'react';
import { Property, PropertyStatusFilter } from '@/types/property';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { Pagination } from '@/components/home/Pagination';

interface MarketSectionProps {
  properties: Property[];
  statusFilter: PropertyStatusFilter;
  totalPages: number;
  currentPage: number;
  total?: number;
  pageSize?: number;
}

export const MarketSection: React.FC<MarketSectionProps> = ({
  properties,
  statusFilter: _statusFilter,
  totalPages,
  currentPage,
  total,
  pageSize,
}) => {
  return (
    <section id="market-properties-section" className="scroll-mt-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark dark:text-white flex items-center gap-3">
            <span>New in Market</span>
            {total !== undefined && total > 0 && (
              <span className="text-xs sm:text-sm font-normal text-nordic-muted dark:text-hint-of-green/60 px-2.5 py-0.5 rounded-full bg-nordic-dark/5 dark:bg-white/5 border border-nordic-dark/5 dark:border-white/10">
                {total} {total === 1 ? 'property' : 'properties'}
              </span>
            )}
          </h2>
          <p className="text-nordic-muted dark:text-hint-of-green/70 mt-1 text-sm">
            Fresh opportunities added this week.
          </p>
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
            />
          ))}
        </div>
      )}

      <Suspense>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
        />
      </Suspense>
    </section>
  );
};
