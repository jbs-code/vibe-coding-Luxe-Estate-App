'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const LeafletMapInner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
});

interface PropertyMapProps {
  latitude?: number;
  longitude?: number;
  title: string;
  address: string;
  location: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude = 37.4419,
  longitude = -122.1430,
  title,
  address,
  location,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-white dark:bg-white/5 p-2 rounded-xl shadow-sm border border-mosque/5 dark:border-white/10">
      {mounted ? (
        <LeafletMapInner
          latitude={latitude}
          longitude={longitude}
          title={title}
          address={address}
          location={location}
        />
      ) : (
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 animate-pulse flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="material-icons text-3xl">map</span>
            <span className="text-xs font-medium">Cargando mapa interactivo...</span>
          </div>
        </div>
      )}
    </div>
  );
};
