'use client'

import { useState, useMemo } from 'react'
import type { PhotoItem } from '../lib/photos'
import PhotoModal from './PhotoModal'

type Props = {
  photos: PhotoItem[]
  initialCity?: string
}

export default function GalleryGrid({ photos, initialCity }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [activeCity, setActiveCity] = useState<string>(initialCity ?? '')

  const cities = useMemo(() => {
    const set = new Set(photos.map((p) => p.city).filter(Boolean))
    return Array.from(set).sort()
  }, [photos])

  const filtered = useMemo(() => {
    if (!activeCity) return photos
    return photos.filter((p) => p.city === activeCity)
  }, [photos, activeCity])

  const selected = selectedIndex !== null ? filtered[selectedIndex] : null

  return (
    <>
      {/* City filter tabs */}
      {cities.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCity('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCity === ''
                ? 'text-white shadow-md'
                : 'bg-white text-gray-600 shadow-sm hover:shadow-md'
            }`}
            style={activeCity === '' ? { backgroundColor: '#4a7c59' } : undefined}
          >
            All
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCity === city
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-600 shadow-sm hover:shadow-md'
              }`}
              style={activeCity === city ? { backgroundColor: '#4a7c59' } : undefined}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(i)}
            className="group text-left"
          >
            <div className="relative aspect-square rounded-[20px] overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.photo}
                alt={photo.note || photo.title}
                className="w-full h-full object-cover transition-[filter] duration-300 group-hover:brightness-75"
              />
              {/* Note on hover */}
              {photo.note && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                  <p className="text-white/90 text-xs leading-relaxed line-clamp-3">
                    {photo.note}
                  </p>
                </div>
              )}
            </div>
            {/* Title below image */}
            <p className="mt-2 text-sm font-semibold truncate" style={{ color: '#4a7c59' }}>
              {photo.title}
            </p>
            {photo.date && (
              <p className="text-xs text-gray-400">{photo.date}</p>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-400 text-center py-20">No photos found.</p>
      )}

      {/* Modal */}
      {selected && selectedIndex !== null && (
        <PhotoModal
          photo={selected}
          onClose={() => setSelectedIndex(null)}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : undefined}
          onNext={selectedIndex < filtered.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : undefined}
        />
      )}
    </>
  )
}
