import type { Metadata } from 'next';
import { AdminNavbar } from '@/components/admin/AdminNavbar';

export const metadata: Metadata = {
  title: 'Admin Panel — Luxe Estate',
  description: 'Luxe Estate administration dashboard.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-nordic dark:text-gray-100 font-display flex flex-col antialiased">
      <AdminNavbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}
