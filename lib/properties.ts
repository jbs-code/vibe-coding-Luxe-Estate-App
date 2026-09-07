import { supabase } from '@/lib/supabase';
import { Property, PropertyCategory, PropertyStatusFilter } from '@/types/property';

export const MARKET_PAGE_SIZE = 6;

export interface MarketPropertiesResult {
  properties: Property[];
  total: number;
  totalPages: number;
  currentPage: number;
}

interface GetMarketPropertiesParams {
  page?: number;
  status?: PropertyStatusFilter;
  type?: PropertyCategory;
  search?: string;
}

// Helper to normalize image array from DB
function parseImages(imageUrl: unknown): string[] {
  if (Array.isArray(imageUrl)) {
    return imageUrl.filter((url): url is string => typeof url === 'string' && url.length > 0);
  }
  if (typeof imageUrl === 'string' && imageUrl.trim()) {
    return [imageUrl];
  }
  return [];
}

// Maps DB row to Property type
export function rowToProperty(row: Record<string, unknown>): Property {
  const images = parseImages(row.image_url);
  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
  const slug = (row.slug as string) || (row.id as string);

  return {
    id: row.id as string,
    slug,
    title: row.title as string,
    price: Number(row.price),
    priceFormatted: row.price_formatted as string,
    pricePeriod: (row.price_period as string) ?? undefined,
    address: row.address as string,
    location: row.location as string,
    beds: Number(row.beds),
    baths: Number(row.baths),
    area: row.area as string,
    imageUrl: primaryImage,
    images: images.length > 0 ? images : [primaryImage],
    imageAlt: (row.image_alt as string) || (row.title as string),
    type: row.type as Property['type'],
    status: row.status as Property['status'],
    isFeatured: Boolean(row.is_featured),
    tag: (row.tag as string) ?? undefined,
    isFavorite: false,
    description: (row.description as string) ?? undefined,
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : undefined,
    garage: row.garage !== undefined && row.garage !== null ? Number(row.garage) : 2,
    latitude: row.latitude !== undefined && row.latitude !== null ? Number(row.latitude) : 37.4419,
    longitude: row.longitude !== undefined && row.longitude !== null ? Number(row.longitude) : -122.1430,
    agent: {
      name: (row.agent_name as string) || 'Sarah Jenkins',
      avatar: (row.agent_avatar as string) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w',
      phone: (row.agent_phone as string) || '+1 (555) 349-8200',
      email: (row.agent_email as string) || 'sarah.jenkins@luxeestate.com',
      title: (row.agent_title as string) || 'Top Rated Agent',
    },
  };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const isUuid = UUID_REGEX.test(slug);

  let query = supabase.from('properties').select('*');

  if (isUuid) {
    query = query.or(`slug.eq.${slug},id.eq.${slug}`);
  } else {
    query = query.eq('slug', slug);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error(`Error fetching property with slug "${slug}":`, error);
    return null;
  }

  if (!data) {
    return null;
  }

  return rowToProperty(data);
}

export async function getAllPropertySlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('slug');

  if (error || !data) {
    console.error('Error fetching property slugs:', error);
    return [];
  }

  return data.map((item) => item.slug).filter(Boolean);
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return (data ?? []).map(rowToProperty);
}

export async function getMarketProperties({
  page = 1,
  status = 'all',
  type = 'all',
  search = '',
}: GetMarketPropertiesParams): Promise<MarketPropertiesResult> {
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * MARKET_PAGE_SIZE;
  const to = from + MARKET_PAGE_SIZE - 1;

  // Build the count query
  let countQuery = supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    .eq('is_featured', false);

  if (status !== 'all') {
    countQuery = countQuery.eq('status', status);
  }
  if (type !== 'all') {
    countQuery = countQuery.eq('type', type);
  }
  if (search.trim()) {
    countQuery = countQuery.or(
      `title.ilike.%${search}%,location.ilike.%${search}%,address.ilike.%${search}%,type.ilike.%${search}%`
    );
  }

  // Build the data query
  let dataQuery = supabase
    .from('properties')
    .select('*')
    .eq('is_featured', false)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status !== 'all') {
    dataQuery = dataQuery.eq('status', status);
  }
  if (type !== 'all') {
    dataQuery = dataQuery.eq('type', type);
  }
  if (search.trim()) {
    dataQuery = dataQuery.or(
      `title.ilike.%${search}%,location.ilike.%${search}%,address.ilike.%${search}%,type.ilike.%${search}%`
    );
  }

  const [{ count }, { data, error }] = await Promise.all([countQuery, dataQuery]);

  if (error) {
    console.error('Error fetching market properties:', error);
    return { properties: [], total: 0, totalPages: 0, currentPage: safePage };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / MARKET_PAGE_SIZE);
  const properties = (data ?? []).map(rowToProperty);

  return { properties, total, totalPages, currentPage: safePage };
}

