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

  const [{ properties, totalPages, currentPage }, featuredProperties] = await Promise.all([
    getMarketProperties({
      page,
      status,
      type,
      search,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities,
    }),
    getFeaturedProperties(),
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

        {/* Featured Collections Section */}
        <FeaturedSection properties={featuredProperties} />

        {/* New in Market Section — server-side paginated */}
        <MarketSection
          properties={properties}
          statusFilter={status}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </main>
    </div>
  );
}
