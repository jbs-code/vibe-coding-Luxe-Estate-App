import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/properties';
import { Navbar } from '@/components/shared/Navbar';
import { PropertyGallery } from '@/components/property-details/PropertyGallery';
import { PropertyMap } from '@/components/property-details/PropertyMap';
import { AgentCard } from '@/components/property-details/AgentCard';
import { MortgageCalculator } from '@/components/property-details/MortgageCalculator';

interface PropertyDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({
  params,
}: PropertyDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Propiedad no encontrada | LuxeEstate',
      description: 'La propiedad que estás buscando no se encuentra disponible.',
    };
  }

  const title = `${property.title} - ${property.type.toUpperCase()} en ${property.location} | LuxeEstate`;
  const description =
    property.description ||
    `Descubre ${property.title}, una magnífica propiedad de ${property.area} con ${property.beds} habitaciones y ${property.baths} baños en ${property.location}. Precio: ${property.priceFormatted}.`;

  const ogImage = property.images[0] || property.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.imageAlt || property.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

// Optional Static Params generation
export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    image: property.images,
    url: `https://luxeestate.com/propiedades/${property.slug}`,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.location,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.latitude || 37.4419,
      longitude: property.longitude || -122.1430,
    },
    numberOfRooms: property.beds,
    numberOfBedrooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
    },
  };

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
    <div className="min-h-screen bg-clear-day dark:bg-background-dark text-nordic dark:text-white selection:bg-mosque/20">
      {/* JSON-LD Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Top Left: Interactive Gallery */}
          <div className="lg:col-span-8">
            <PropertyGallery
              images={property.images}
              title={property.title}
              tag={property.tag}
              isFeatured={property.isFeatured}
            />
          </div>

          {/* Right Column: Sticky Pricing, Agent & Map */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <AgentCard
                priceFormatted={property.priceFormatted}
                pricePeriod={property.pricePeriod}
                address={property.address}
                location={property.location}
                agent={property.agent}
                propertyTitle={property.title}
              />

              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                title={property.title}
                address={property.address}
                location={property.location}
              />
            </div>
          </div>

          {/* Bottom Left: Property Details & Features */}
          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            {/* Property Features Card */}
            <section
              aria-label="Características de la propiedad"
              className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10"
            >
              <h2 className="text-lg font-semibold mb-6 text-nordic dark:text-white">
                Property Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
                  <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                    square_foot
                  </span>
                  <span className="text-xl font-bold text-nordic dark:text-white">
                    {property.area.replace(/[^0-9,]/g, '') || '240'}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60">
                    Square Meters
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
                  <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                    bed
                  </span>
                  <span className="text-xl font-bold text-nordic dark:text-white">
                    {property.beds}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60">
                    Bedrooms
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
                  <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                    shower
                  </span>
                  <span className="text-xl font-bold text-nordic dark:text-white">
                    {property.baths}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60">
                    Bathrooms
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 dark:bg-white/5 rounded-lg border border-mosque/10 dark:border-white/10">
                  <span className="material-icons text-mosque dark:text-hint-of-green text-2xl mb-2">
                    directions_car
                  </span>
                  <span className="text-xl font-bold text-nordic dark:text-white">
                    {property.garage ?? 2}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50 dark:text-white/60">
                    Garage
                  </span>
                </div>
              </div>
            </section>

            {/* About This Home Card */}
            <section
              aria-label="Acerca de esta propiedad"
              className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10"
            >
              <h2 className="text-lg font-semibold mb-4 text-nordic dark:text-white">
                About this home
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
              aria-label="Amenidades"
              className="bg-white dark:bg-white/5 p-8 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10"
            >
              <h2 className="text-lg font-semibold mb-6 text-nordic dark:text-white">
                Amenities
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
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Estimated Payment / Mortgage Calculator */}
            <MortgageCalculator price={property.price} />
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="bg-white dark:bg-black/20 border-t border-slate-200 dark:border-white/10 mt-12 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-nordic/50 dark:text-white/50">
            © {new Date().getFullYear()} LuxeEstate Inc. All rights reserved.
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
    </div>
  );
}
