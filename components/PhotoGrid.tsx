'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createPortal } from 'react-dom'

type Photo = {
  id: string
  title: string
  src: string
  date?: string
  note?: string
}

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const searchParams = useSearchParams()
  const city = searchParams.get('city')
  const [selected, setSelected] = useState<Photo | null>(null)

  const filtered = city
    ? photos.filter((p) => p.title.toLowerCase() === city.toLowerCase())
    : photos

  return (
    <>
      {city && (
        <p className="text-sm text-gray-500 mb-4">
          Filtered by: <span className="font-medium text-gray-700">{city}</span>
          {' '}({filtered.length} photos)
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No photos found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="rounded-[16px] md:rounded-[32px] overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full aspect-square md:w-64 md:h-64 object-cover"
              />
              <p className="text-xs md:text-sm text-gray-700 text-center py-1.5 md:py-2 bg-white truncate px-2">{photo.title}</p>
            </div>
          ))}
        </div>
      )}

      {selected && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative bg-white rounded-[32px] overflow-hidden max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white text-sm hover:bg-black/70 transition"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
            <img
              src={selected.src}
              alt={selected.title}
              className="w-full object-cover"
              style={{ maxHeight: '60vh' }}
            />
            <div className="p-6">
              {selected.title && (
                <h3 className="text-xl font-semibold">{selected.title}</h3>
              )}
              {selected.date && (
                <p className="text-sm text-gray-500 mt-1">{selected.date}</p>
              )}
              {selected.note && (
                <p className="text-gray-700 mt-2">{selected.note}</p>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
