import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rowToProperty } from '@/lib/properties';
import { PropertyForm } from '@/components/admin/PropertyForm';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('properties')
    .select('title')
    .eq('id', id)
    .maybeSingle();

  return {
    title: data?.title ? `Edit ${data.title} — Admin | Luxe Estate` : 'Edit Property — Admin | Luxe Estate',
    description: 'Edit luxury property details in Luxe Estate portfolio.',
  };
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const property = rowToProperty(data);

  return <PropertyForm mode="edit" initialProperty={property} />;
}
