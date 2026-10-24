'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/types/property';

interface PropertiesTableProps {
  initialProperties: Property[];
}

const ITEMS_PER_PAGE = 5;

export function PropertiesTable({ initialProperties }: PropertiesTableProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'sale' | 'rent'>('all');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Compute stats for KPI cards
  const stats = useMemo(() => {
    const total = properties.length;
    const active = properties.filter((p) => p.status === 'sale').length;
    const pendingOrRent = properties.filter((p) => p.status === 'rent').length;
    return { total, active, pendingOrRent };
  }, [properties]);

  // Filter properties
  const filtered = useMemo(() => {
    if (statusFilter === 'all') return properties;
    return properties.filter((p) => p.status === statusFilter);
  }, [properties, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedProperties = useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(from, from + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert('Error al eliminar la propiedad en la base de datos.');
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Error de conexión al eliminar la propiedad.');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-nordic dark:text-white tracking-tight">
              My Properties
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your portfolio and track performance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterModalOpen(!filterModalOpen)}
                className="bg-white dark:bg-[#152e2a] border border-gray-200 dark:border-primary/30 text-nordic dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/10 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span className="material-icons text-base">filter_list</span>
                <span>
                  {statusFilter === 'all'
                    ? 'Filter'
                    : statusFilter === 'sale'
                    ? 'En Venta'
                    : 'En Alquiler'}
                </span>
              </button>

              {filterModalOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#152e2a] shadow-dropdown border border-gray-100 dark:border-primary/20 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('all');
                      setCurrentPage(1);
                      setFilterModalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-nordic dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    Todas las propiedades
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('sale');
                      setCurrentPage(1);
                      setFilterModalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === 'sale'
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-nordic dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    En Venta (Active)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('rent');
                      setCurrentPage(1);
                      setFilterModalOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                      statusFilter === 'rent'
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-nordic dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    En Alquiler (Pending / Rent)
                  </button>
                </div>
              )}
            </div>

            {/* Add New Property Button */}
            <Link
              href="/admin/properties/new"
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-primary/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
            >
              <span className="material-icons text-base">add</span>
              <span>Add New Property</span>
            </Link>
          </div>
        </div>

        {/* Stats Overview (3 KPI cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Total Listings */}
          <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Listings</p>
              <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{stats.total}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-icons">apartment</span>
            </div>
          </div>

          {/* Card 2: Active Properties */}
          <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Properties</p>
              <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{stats.active}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-hint-green flex items-center justify-center text-primary">
              <span className="material-icons">check_circle</span>
            </div>
          </div>

          {/* Card 3: Pending / Alquiler */}
          <div className="bg-white dark:bg-[#152e2a] p-5 rounded-xl border border-primary/10 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Sale</p>
              <p className="text-2xl font-bold text-nordic dark:text-white mt-1">{stats.pendingOrRent}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <span className="material-icons">pending</span>
            </div>
          </div>
        </div>

        {/* Property List Container */}
        <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-200 dark:border-primary/20 overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 dark:bg-primary/5 border-b border-gray-100 dark:border-primary/10 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-6">Property Details</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* List Items */}
          {paginatedProperties.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No hay propiedades registradas con este filtro.
            </div>
          ) : (
            paginatedProperties.map((property) => {
              // Calculate estimated monthly rent or format price
              const monthlyEstimate = Math.round(property.price / 300);
              const isSale = property.status === 'sale';

              return (
                <div
                  key={property.id}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-gray-100 dark:border-primary/10 hover:bg-background-light dark:hover:bg-primary/5 transition-colors items-center"
                >
                  {/* Property Details (col-span-6) */}
                  <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
                    <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src={property.imageUrl}
                        alt={property.imageAlt || property.title}
                        fill
                        sizes="112px"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    <div>
                      <Link
                        href={`/propiedades/${property.slug}`}
                        className="text-lg font-bold text-nordic dark:text-white group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
                      >
                        {property.title}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {property.address}, {property.location}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-[14px]">bed</span>
                          {property.beds} Beds
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1">
                          <span className="material-icons text-[14px]">bathtub</span>
                          {property.baths} Baths
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>{property.area}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price (col-span-2) */}
                  <div className="col-span-6 md:col-span-2">
                    <div className="text-base font-semibold text-nordic dark:text-gray-200">
                      {property.priceFormatted}
                    </div>
                    <div className="text-xs text-gray-400">
                      {isSale ? `Monthly: $${monthlyEstimate.toLocaleString()}` : 'Por mes'}
                    </div>
                  </div>

                  {/* Status (col-span-2) */}
                  <div className="col-span-6 md:col-span-2">
                    {isSale ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-green text-primary border border-primary/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Actions (col-span-2) */}
                  <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-hint-green/30 transition-all cursor-pointer inline-flex items-center"
                      title="Edit Property"
                    >
                      <span className="material-icons text-xl">edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(property.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                      title="Delete Property"
                    >
                      <span className="material-icons text-xl">delete_outline</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-primary/20 flex items-center justify-between bg-gray-50/50 dark:bg-primary/5">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing{' '}
              <span className="font-medium text-nordic dark:text-white">
                {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}
              </span>{' '}
              to{' '}
              <span className="font-medium text-nordic dark:text-white">
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium text-nordic dark:text-white">{filtered.length}</span>{' '}
              results
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-200 dark:border-primary/30 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-primary/20 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#152e2a] rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-200 dark:border-primary/20">
            <h3 className="text-lg font-bold text-nordic dark:text-white">¿Eliminar propiedad?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Esta acción eliminará la propiedad de la lista del panel administrativo.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-primary/20 bg-white dark:bg-[#152e2a]">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            © 2026 Haven / LuxeEstate Property Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
