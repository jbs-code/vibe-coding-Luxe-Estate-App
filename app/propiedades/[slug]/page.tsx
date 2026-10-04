import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getPropertyBySlug, getAllPropertySlugs } from '@/lib/properties';
import { Navbar } from '@/components/shared/Navbar';
import { PropertyGallery } from '@/components/property-details/PropertyGallery';
import { PropertyMap } from '@/components/property-details/PropertyMap';
import { AgentCard } from '@/components/property-details/AgentCard';
import { PropertyDetailsContent } from '@/components/property-details/PropertyDetailsContent';

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

          {/* Bottom Left: Property Details, Features, Amenities & Footer */}
          <PropertyDetailsContent property={property} />
        </div>
      </main>
    </div>
  );
}
