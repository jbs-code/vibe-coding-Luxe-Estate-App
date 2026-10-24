import type { Metadata } from 'next';
import { PropertyForm } from '@/components/admin/PropertyForm';

export const metadata: Metadata = {
  title: 'Add New Property — Admin | Luxe Estate',
  description: 'Create a new luxury property listing in Luxe Estate portfolio.',
};

export default function NewPropertyPage() {
  return <PropertyForm mode="create" />;
}
