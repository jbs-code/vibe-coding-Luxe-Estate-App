import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PropertiesTable } from '@/components/admin/PropertiesTable';
import { rowToProperty } from '@/lib/properties';

export const metadata = {
  title: 'My Properties — Admin | Luxe Estate',
  description: 'Manage your portfolio and track performance.',
};

export default async function AdminPropertiesPage() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminPropertiesPage] Error fetching properties:', error);
  }

  const properties = (data ?? []).map(rowToProperty);

  return <PropertiesTable initialProperties={properties} />;
}

