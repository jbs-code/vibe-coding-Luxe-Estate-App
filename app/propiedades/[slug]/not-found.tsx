import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/Navbar';

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-clear-day dark:bg-background-dark text-nordic dark:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-mosque/10 dark:bg-hint-of-green/20 text-mosque dark:text-hint-of-green rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-icons text-4xl">home_work</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold font-display mb-3">
          Propiedad No Encontrada
        </h1>

        <p className="text-nordic/60 dark:text-hint-of-green/70 mb-8 max-w-md mx-auto">
          La propiedad que estás buscando ha sido vendida, retirada del mercado o la dirección ingresada no es válida.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-mosque hover:bg-primary-hover dark:bg-hint-of-green dark:hover:bg-hint-of-green/90 text-white dark:text-nordic font-semibold rounded-lg transition-colors shadow-md"
          >
            Explorar Propiedades
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-white/10 border border-nordic/10 dark:border-white/20 hover:border-mosque text-nordic dark:text-white font-semibold rounded-lg transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-nordic/40 dark:text-white/40 border-t border-slate-200 dark:border-white/10">
        © {new Date().getFullYear()} LuxeEstate Inc. All rights reserved.
      </footer>
    </div>
  );
}
