'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './TravelGallery.module.css'

type Photo = {
  id: string
  title: string
  src: string
  date?: string
  note?: string
}

const fallbackPhotos: Photo[] = [
  { id: '1', title: 'Eiffel Tower', src: 'https://picsum.photos/seed/eiffel/512/512' },
  { id: '2', title: 'Colosseum', src: 'https://picsum.photos/seed/colosseum/512/512' },
  { id: '3', title: 'Sagrada Familia', src: 'https://picsum.photos/seed/sagrada/512/512' },
  { id: '4', title: 'Santorini', src: 'https://picsum.photos/seed/santorini/512/512' },
  { id: '5', title: 'Swiss Alps', src: 'https://picsum.photos/seed/alps/512/512' },
  { id: '6', title: 'Amsterdam Canal', src: 'https://picsum.photos/seed/amsterdam/512/512' },
]

export default function TravelGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null)
  const displayPhotos = photos.length > 0 ? photos : fallbackPhotos
  const doubled = [...displayPhotos, ...displayPhotos]

  return (
    <section className="mb-12">
      <div className={styles.scrollContainer}>
        <div className={styles.scrollTrack}>
          {doubled.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className="flex-shrink-0 hover:-translate-y-1 transition-all duration-200 rounded-[20px] overflow-hidden cursor-pointer"
              style={{
                background: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
              }}
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-40 h-40 md:w-64 md:h-64 object-cover"
              />
              <p className="text-sm text-gray-700 text-center py-2 bg-white">{photo.title}</p>
            </div>
          ))}
        </div>
      </div>

      {selected && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative rounded-[20px] overflow-hidden max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            style={{
              background: '#FFFFFF',
              boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
            }}
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
    </section>
  )
}
