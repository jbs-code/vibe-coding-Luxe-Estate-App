export type PropertyCategory = 'all' | 'house' | 'apartment' | 'villa' | 'penthouse' | 'studio';

export type PropertyStatus = 'sale' | 'rent';

export type PropertyStatusFilter = 'all' | 'sale' | 'rent';

export interface Property {
  id: string;
  title: string;
  price: number;
  priceFormatted: string;
  pricePeriod?: string; // e.g. "/mo"
  address: string;
  location: string;
  beds: number;
  baths: number;
  area: string; // e.g. "4,200 m²" or "120m²"
  imageUrl: string;
  imageAlt: string;
  type: 'house' | 'apartment' | 'villa' | 'penthouse' | 'studio';
  status: PropertyStatus;
  isFeatured?: boolean;
  tag?: string; // e.g. "Exclusive", "New Arrival"
  isFavorite?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}
