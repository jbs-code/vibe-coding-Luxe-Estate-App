export type PropertyCategory = 'all' | 'house' | 'apartment' | 'villa' | 'penthouse' | 'studio';

export type PropertyStatus = 'sale' | 'rent';

export type PropertyStatusFilter = 'all' | 'sale' | 'rent';

export interface PropertyAgent {
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
  title?: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  priceFormatted: string;
  pricePeriod?: string; // e.g. "/mo"
  address: string;
  location: string;
  beds: number;
  baths: number;
  area: string; // e.g. "4,200 m²" or "120m²"
  imageUrl: string; // Main hero image
  images: string[]; // All gallery images
  imageAlt: string;
  type: 'house' | 'apartment' | 'villa' | 'penthouse' | 'studio';
  status: PropertyStatus;
  isFeatured?: boolean;
  tag?: string; // e.g. "Exclusive", "New Arrival"
  isFavorite?: boolean;
  description?: string;
  amenities?: string[];
  garage?: number;
  latitude?: number;
  longitude?: number;
  agent?: PropertyAgent;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface MarketPropertiesResult {
  properties: Property[];
  total: number;
  totalPages: number;
  currentPage: number;
}
