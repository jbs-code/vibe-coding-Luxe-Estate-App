'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address: string;
  location: string;
}

const LeafletMapInner: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  title,
  address,
  location,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const lat = latitude || 37.4419;
    const lng = longitude || -122.1430;

    // Create Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // Add OpenStreetMap tile layer (CartoDB Positron / OSM clean)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // Custom LuxeEstate Pin icon
    const customIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#006655;border:3px solid #ffffff;border-radius:50%;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);cursor:pointer;">
          <span style="font-family:'Material Icons';color:#ffffff;font-size:18px;line-height:1;">home</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });

    // Add Marker & Popup
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: Inter, sans-serif; padding: 4px; max-width: 200px;">
        <strong style="color: #19322F; font-size: 14px; display: block; margin-bottom: 2px;">${title}</strong>
        <p style="color: #64748B; font-size: 12px; margin: 0;">${address}</p>
      </div>
    `);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude, title, address]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${title}, ${address}, ${location}`
  )}`;

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 z-0">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-white/95 hover:bg-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md text-nordic hover:text-mosque transition-colors z-[1000] flex items-center gap-1 backdrop-blur-sm"
      >
        <span className="material-icons text-xs text-mosque">open_in_new</span>
        View on Map
      </a>
    </div>
  );
};

export default LeafletMapInner;
