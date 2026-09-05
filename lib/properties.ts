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

// Maps DB row to Property type
function rowToProperty(row: Record<string, unknown>): Property {
  return {
    id: row.id as string,
    title: row.title as string,
    price: Number(row.price),
    priceFormatted: row.price_formatted as string,
    pricePeriod: (row.price_period as string) ?? undefined,
    address: row.address as string,
    location: row.location as string,
    beds: Number(row.beds),
    baths: Number(row.baths),
    area: row.area as string,
    imageUrl: row.image_url as string,
    imageAlt: row.image_alt as string,
    type: row.type as Property['type'],
    status: row.status as Property['status'],
    isFeatured: Boolean(row.is_featured),
    tag: (row.tag as string) ?? undefined,
    isFavorite: false,
  };
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
