import { Suspense } from 'react';
import { Navbar } from '@/components/shared/Navbar';
import { HeroSearch } from '@/components/home/HeroSearch';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { MarketSection } from '@/components/home/MarketSection';
import { getMarketProperties, getFeaturedProperties } from '@/lib/properties';
import { PropertyCategory, PropertyStatusFilter } from '@/types/property';

export default async function HomeScreen({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Math.max(1, parseInt((params.page as string) ?? '1', 10));
  const pageSize = params.pageSize ? Math.max(1, parseInt(params.pageSize as string, 10)) : undefined;
  const status = (params.status as PropertyStatusFilter) ?? 'all';
  const type = (params.type as PropertyCategory) ?? 'all';
  const search = (params.q as string) ?? '';
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const beds = params.beds ? Number(params.beds) : undefined;
  const baths = params.baths ? Number(params.baths) : undefined;
  const amenities = typeof params.amenities === 'string'
    ? params.amenities.split(',').filter(Boolean)
    : Array.isArray(params.amenities)
    ? (params.amenities as string[])
    : undefined;

  // Determine if any filters are currently active (search, category, status, price, beds, baths, amenities)
  const hasActiveFilters = Boolean(
    (search && search.trim().length > 0) ||
    (type && type !== 'all') ||
    (status && status !== 'all') ||
    (minPrice !== undefined && !isNaN(minPrice) && minPrice > 0) ||
    (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice < 20000000) ||
    (beds !== undefined && !isNaN(beds) && beds > 0) ||
    (baths !== undefined && !isNaN(baths) && baths > 0) ||
    (amenities && amenities.length > 0)
  );

  const [{ properties, totalPages, currentPage, total }, featuredProperties] = await Promise.all([
    getMarketProperties({
      page,
      pageSize,
      status,
      type,
      search,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities,
    }),
    hasActiveFilters ? Promise.resolve([]) : getFeaturedProperties(),
  ]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full flex-grow">
        {/* Hero & Search Section */}
        <Suspense>
          <HeroSearch
            searchQuery={search}
            selectedCategory={type}
            statusFilter={status}
          />
        </Suspense>

        {/* Featured Collections Section — Hidden when filters are active */}
        {!hasActiveFilters && featuredProperties.length > 0 && (
          <FeaturedSection properties={featuredProperties} />
        )}

        {/* New in Market Section — server-side paginated */}
        <MarketSection
          properties={properties}
          statusFilter={status}
          totalPages={totalPages}
          currentPage={currentPage}
          total={total}
          pageSize={pageSize}
        />
      </main>
    </div>
  );
}
