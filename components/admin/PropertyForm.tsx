'use client';

import React, { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Property } from '@/types/property';

interface PropertyFormProps {
  mode: 'create' | 'edit';
  initialProperty?: Property;
}

const COMMON_AMENITIES = [
  'Swimming Pool',
  'Garden',
  'Air Conditioning',
  'Smart Home System',
  'Private Gym',
  'Wine Cellar',
  'Central Heating & Cooling',
  'Electric Vehicle Charging',
];

export function PropertyForm({ mode, initialProperty }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(initialProperty?.title || '');
  const [price, setPrice] = useState<number | string>(initialProperty?.price ?? '');
  const [status, setStatus] = useState<'sale' | 'rent'>(initialProperty?.status || 'sale');
  const [pricePeriod, setPricePeriod] = useState(initialProperty?.pricePeriod || '/mo');
  const [type, setType] = useState<Property['type']>(initialProperty?.type || 'house');
  const [isFeatured, setIsFeatured] = useState(Boolean(initialProperty?.isFeatured));
  const [tag, setTag] = useState(initialProperty?.tag || '');
  const [description, setDescription] = useState(initialProperty?.description || '');

  // Gallery images
  const [images, setImages] = useState<string[]>(
    initialProperty?.images && initialProperty.images.length > 0
      ? initialProperty.images
      : initialProperty?.imageUrl
      ? [initialProperty.imageUrl]
      : []
  );

  // Location
  const [address, setAddress] = useState(initialProperty?.address || '');
  const [location, setLocation] = useState(initialProperty?.location || '');
  const [latitude, setLatitude] = useState<number | string>(initialProperty?.latitude ?? 37.4419);
  const [longitude, setLongitude] = useState<number | string>(initialProperty?.longitude ?? -122.143);

  // Details
  const [area, setArea] = useState(initialProperty?.area || '');
  const [beds, setBeds] = useState(initialProperty?.beds ?? 3);
  const [baths, setBaths] = useState(initialProperty?.baths ?? 2);
  const [garage, setGarage] = useState(initialProperty?.garage ?? 1);
  const [amenities, setAmenities] = useState<string[]>(
    initialProperty?.amenities || ['Garden', 'Air Conditioning']
  );

  // Agent
  const [agentName, setAgentName] = useState(initialProperty?.agent?.name || 'Sarah Jenkins');
  const [agentPhone, setAgentPhone] = useState(initialProperty?.agent?.phone || '+1 (555) 349-8200');
  const [agentEmail, setAgentEmail] = useState(initialProperty?.agent?.email || 'sarah.jenkins@luxeestate.com');

  // Handle image upload via API
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMessage(null);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`El archivo "${file.name}" supera el límite de 5MB.`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/properties/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        } else {
          const err = await res.json();
          setErrorMessage(err.error || 'Error al subir imagen.');
        }
      } catch (err) {
        console.error('Error subiendo imagen:', err);
        setErrorMessage('Error de red al subir imagen.');
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls]);
    }
    setIsUploading(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetMainImage = (indexToMain: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(indexToMain, 1);
      return [selected, ...copy];
    });
  };

  const toggleAmenity = (amenityName: string) => {
    setAmenities((prev) =>
      prev.includes(amenityName)
        ? prev.filter((a) => a !== amenityName)
        : [...prev, amenityName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) {
      setErrorMessage('Por favor ingresa el título de la propiedad.');
      return;
    }
    if (price === '' || isNaN(Number(price))) {
      setErrorMessage('Por favor ingresa un precio válido.');
      return;
    }
    if (!address.trim() || !location.trim()) {
      setErrorMessage('Por favor completa la dirección y ubicación.');
      return;
    }

    const payload = {
      title,
      price: Number(price),
      pricePeriod: status === 'rent' ? pricePeriod : null,
      address,
      location,
      beds: Number(beds),
      baths: Number(baths),
      area: area.trim() ? area : '200 m²',
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      type,
      status,
      isFeatured,
      tag: tag.trim() || null,
      description,
      amenities,
      garage: Number(garage),
      latitude: Number(latitude),
      longitude: Number(longitude),
      agentName,
      agentPhone,
      agentEmail,
      agentAvatar: initialProperty?.agent?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w',
      agentTitle: initialProperty?.agent?.title || 'Top Rated Luxury Agent',
    };

    startTransition(async () => {
      try {
        const endpoint =
          mode === 'create'
            ? '/api/admin/properties'
            : `/api/admin/properties/${initialProperty?.id}`;
        const method = mode === 'create' ? 'POST' : 'PUT';

        const res = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setSuccessMessage(
            mode === 'create'
              ? 'Propiedad creada exitosamente.'
              : 'Propiedad actualizada exitosamente.'
          );
          setTimeout(() => {
            router.push('/admin/properties');
            router.refresh();
          }, 1200);
        } else {
          const err = await res.json();
          setErrorMessage(err.error || 'Error al guardar propiedad.');
        }
      } catch (err) {
        console.error('Error al guardar propiedad:', err);
        setErrorMessage('Error de red al guardar la propiedad.');
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-clear-day dark:bg-background-dark text-nordic dark:text-gray-100 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 dark:border-primary/20 pb-8">
          <div className="space-y-4">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex">
              <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 font-medium font-sans">
                <li>
                  <Link href="/admin/properties" className="hover:text-mosque dark:hover:text-hint-green transition-colors">
                    Properties
                  </Link>
                </li>
                <li>
                  <span className="material-icons text-xs text-gray-400">chevron_right</span>
                </li>
                <li aria-current="page" className="text-nordic dark:text-white font-semibold">
                  {mode === 'create' ? 'Add New' : 'Edit Property'}
                </li>
              </ol>
            </nav>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-nordic dark:text-white tracking-tight mb-2">
                {mode === 'create' ? 'Add New Property' : 'Edit Property'}
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl font-normal font-sans">
                Fill in the details below to {mode === 'create' ? 'create a new listing' : 'update this property listing'}. Fields marked with * are mandatory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/properties"
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-primary/30 bg-white dark:bg-[#152e2a] text-nordic dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-primary/10 transition-colors font-medium font-sans text-sm inline-flex items-center"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || isUploading}
              className="px-5 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-sans text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-icons text-sm">save</span>
              )}
              <span>{mode === 'create' ? 'Save Property' : 'Update Property'}</span>
            </button>
          </div>
        </header>

        {/* Notifications */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
            <span className="material-icons text-red-500">error_outline</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-hint-green/40 dark:bg-primary/20 border border-primary/20 text-nordic dark:text-hint-green text-sm flex items-center gap-3">
            <span className="material-icons text-primary">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols) */}
          <div className="xl:col-span-8 space-y-8">
            {/* 1. Basic Information */}
            <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 dark:border-primary/20 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 dark:from-primary/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green dark:bg-primary/30 flex items-center justify-center text-nordic dark:text-hint-green">
                  <span className="material-icons text-lg">info</span>
                </div>
                <h2 className="text-xl font-bold text-nordic dark:text-white">Basic Information</h2>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-nordic dark:text-gray-200 mb-1.5 font-sans" htmlFor="title">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Modern Penthouse with Ocean View"
                    className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sans outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-nordic dark:text-gray-200 mb-1.5 font-sans" htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sans text-sm">$</span>
                      <input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sans outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-nordic dark:text-gray-200 mb-1.5 font-sans" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'sale' | 'rent')}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sans cursor-pointer outline-none"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-nordic dark:text-gray-200 mb-1.5 font-sans" htmlFor="type">
                      Property Type
                    </label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value as Property['type'])}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sans cursor-pointer outline-none"
                    >
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                </div>

                {/* Featured and Tag */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <input
                      id="isFeatured"
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-5 h-5 text-mosque rounded border-gray-300 focus:ring-mosque cursor-pointer"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-nordic dark:text-white font-sans cursor-pointer">
                      Featured Property (Highlight on homepage)
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 font-medium font-sans mb-1" htmlFor="tag">
                      Marketing Tag (e.g. Exclusive, New Arrival)
                    </label>
                    <input
                      id="tag"
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="Exclusive, Rare Find, etc."
                      className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white text-sm font-sans outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Description */}
            <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 dark:border-primary/20 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 dark:from-primary/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green dark:bg-primary/30 flex items-center justify-center text-nordic dark:text-hint-green">
                  <span className="material-icons text-lg">description</span>
                </div>
                <h2 className="text-xl font-bold text-nordic dark:text-white">Description</h2>
              </div>
              <div className="p-8">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  placeholder="Describe the property features, neighborhood, and unique selling points..."
                  className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sans leading-relaxed resize-y min-h-[180px] outline-none"
                />
                <div className="mt-2 text-right text-xs text-gray-400 font-sans">
                  {description.length} / 2000 characters
                </div>
              </div>
            </div>

            {/* 3. Gallery */}
            <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
              <div className="px-8 py-6 border-b border-hint-green/30 dark:border-primary/20 flex justify-between items-center bg-gradient-to-r from-hint-green/10 dark:from-primary/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-hint-green dark:bg-primary/30 flex items-center justify-center text-nordic dark:text-hint-green">
                    <span className="material-icons text-lg">image</span>
                  </div>
                  <h2 className="text-xl font-bold text-nordic dark:text-white">Gallery</h2>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded font-sans">
                  JPG, PNG, WEBP
                </span>
              </div>

              <div className="p-8">
                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 p-8 text-center hover:bg-hint-green/10 dark:hover:bg-primary/10 hover:border-mosque transition-colors cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm text-mosque dark:text-hint-green group-hover:scale-110 transition-transform duration-300">
                      {isUploading ? (
                        <div className="w-5 h-5 border-2 border-mosque/30 border-t-mosque rounded-full animate-spin" />
                      ) : (
                        <span className="material-icons text-2xl">cloud_upload</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-medium text-nordic dark:text-white font-sans">
                        {isUploading ? 'Subiendo imágenes a Supabase Storage...' : 'Click or drag images here'}
                      </p>
                      <p className="text-xs text-gray-400 font-sans">Max file size 5MB per image</p>
                    </div>
                  </div>
                </div>

                {/* Previews Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {images.map((imgUrl, index) => {
                      const isMain = index === 0;
                      return (
                        <div key={`${imgUrl}-${index}`} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-100 dark:bg-gray-700">
                          <Image
                            src={imgUrl}
                            alt={`Preview ${index + 1}`}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                              title="Delete Image"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </button>
                            {!isMain && (
                              <button
                                type="button"
                                onClick={() => handleSetMainImage(index)}
                                className="w-8 h-8 rounded-full bg-white text-nordic hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer"
                                title="Set as Main"
                              >
                                <span className="material-icons text-sm">star</span>
                              </button>
                            )}
                          </div>
                          {isMain && (
                            <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sans uppercase tracking-wider">
                              Main
                            </span>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:text-mosque hover:border-mosque hover:bg-hint-green/20 transition-all cursor-pointer group"
                    >
                      <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                      <span className="text-xs mt-1 font-medium font-sans">Add More</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols) */}
          <div className="xl:col-span-4 space-y-8">
            {/* 4. Location */}
            <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-hint-green/30 dark:border-primary/20 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 dark:from-primary/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green dark:bg-primary/30 flex items-center justify-center text-nordic dark:text-hint-green">
                  <span className="material-icons text-lg">place</span>
                </div>
                <h2 className="text-lg font-bold text-nordic dark:text-white">Location</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nordic dark:text-gray-200 mb-1.5 font-sans" htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="12 Willow Creek Ln"
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sans outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-nordic dark:text-gray-200 mb-1.5 font-sans" htmlFor="location">
                    City, Country / Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Copenhagen, Denmark"
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sans outline-none"
                    required
                  />
                </div>

                {/* Map Preview Container */}
                <div className="relative h-44 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group">
                  <Image
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                    alt="Map Preview"
                    fill
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 dark:bg-[#152e2a]/95 text-nordic dark:text-white px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm text-xs font-bold font-sans flex items-center gap-1.5 border border-nordic/10">
                      <span className="material-icons text-sm text-mosque">place</span>
                      <span>{location || 'Map Pin'}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-gray-400 font-sans mb-1" htmlFor="lat">Latitude</label>
                    <input
                      id="lat"
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 font-sans mb-1" htmlFor="lng">Longitude</label>
                    <input
                      id="lng"
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Details & Specifications */}
            <div className="bg-white dark:bg-[#152e2a] rounded-xl shadow-sm border border-gray-100 dark:border-primary/20 overflow-hidden sticky top-24">
              <div className="px-6 py-4 border-b border-hint-green/30 dark:border-primary/20 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 dark:from-primary/10 to-transparent">
                <div className="w-8 h-8 rounded-full bg-hint-green dark:bg-primary/30 flex items-center justify-center text-nordic dark:text-hint-green">
                  <span className="material-icons text-lg">straighten</span>
                </div>
                <h2 className="text-lg font-bold text-nordic dark:text-white">Details</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 font-medium font-sans mb-1 block" htmlFor="area">
                    Area (e.g. 2,450 sqft or 250 m²)
                  </label>
                  <input
                    id="area"
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="250 m²"
                    className="w-full px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-nordic dark:text-white focus:bg-white focus:ring-1 focus:ring-mosque transition-all font-sans text-sm outline-none"
                  />
                </div>

                <hr className="border-gray-100 dark:border-gray-700" />

                {/* Steppers */}
                <div className="space-y-4">
                  {/* Bedrooms */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic dark:text-gray-200 font-sans flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                    </label>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setBeds(Math.max(1, beds - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-gray-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium text-sm font-sans text-nordic dark:text-white">
                        {beds}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBeds(beds + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-gray-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic dark:text-gray-200 font-sans flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                    </label>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setBaths(Math.max(1, baths - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-gray-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium text-sm font-sans text-nordic dark:text-white">
                        {baths}
                      </span>
                      <button
                        type="button"
                        onClick={() => setBaths(baths + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-gray-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Garage */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-nordic dark:text-gray-200 font-sans flex items-center gap-2">
                      <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                    </label>
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setGarage(Math.max(0, garage - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-r border-gray-100 dark:border-gray-700 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium text-sm font-sans text-nordic dark:text-white">
                        {garage}
                      </span>
                      <button
                        type="button"
                        onClick={() => setGarage(garage + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors border-l border-gray-100 dark:border-gray-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-700" />

                {/* Amenities */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-sans">
                    Amenities
                  </h3>
                  <div className="space-y-2.5">
                    {COMMON_AMENITIES.map((amenity) => {
                      const isChecked = amenities.includes(amenity);
                      return (
                        <label key={amenity} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAmenity(amenity)}
                            className="w-4 h-4 text-mosque rounded border-gray-300 focus:ring-mosque cursor-pointer"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-sans group-hover:text-nordic dark:group-hover:text-white transition-colors">
                            {amenity}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-gray-100 dark:border-gray-700" />

                {/* Agent info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-sans">
                    Assigned Agent
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Agent Name"
                      className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white outline-none"
                    />
                    <input
                      type="text"
                      value={agentPhone}
                      onChange={(e) => setAgentPhone(e.target.value)}
                      placeholder="Agent Phone"
                      className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white outline-none"
                    />
                    <input
                      type="email"
                      value={agentEmail}
                      onChange={(e) => setAgentEmail(e.target.value)}
                      placeholder="Agent Email"
                      className="w-full px-3 py-2 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-nordic dark:text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Fixed Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#152e2a] border-t border-gray-200 dark:border-gray-700 shadow-xl md:hidden z-40 flex gap-3">
            <Link
              href="/admin/properties"
              className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-nordic dark:text-gray-200 font-medium font-sans text-center text-sm"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sans text-sm flex justify-center items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#152e2a] border-t border-gray-100 dark:border-primary/20 py-8 mt-12 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 dark:text-gray-500 font-sans">
          © 2026 Luxe Estate Real Estate Inc. All rights reserved. <br />
          <span className="mt-2 block text-gray-300 dark:text-gray-600">Designed for luxury agencies.</span>
        </div>
      </footer>
    </div>
  );
}
