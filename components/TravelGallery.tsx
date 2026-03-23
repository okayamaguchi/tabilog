'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type Photo = {
  id: string
  title: string
  src: string
  date?: string
  note?: string
}

export default function TravelGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef(0)
  const animRef = useRef<number>(0)
  const pausedRef = useRef(false)

  // duplicate photos for seamless loop
  const doubled = [...photos, ...photos]

  useEffect(() => {
    const track = trackRef.current
    if (!track || photos.length === 0) return

    const speed = 0.8

    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current -= speed
        // reset when first set has fully scrolled out
        const halfWidth = track.scrollWidth / 2
        if (Math.abs(offsetRef.current) >= halfWidth) {
          offsetRef.current = 0
        }
        track.style.transform = `translateX(${offsetRef.current}px)`
      }
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    const pause = () => { pausedRef.current = true }
    const resume = () => { pausedRef.current = false }

    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)
    track.addEventListener('touchstart', pause)
    track.addEventListener('touchend', resume)

    return () => {
      cancelAnimationFrame(animRef.current)
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
      track.removeEventListener('touchstart', pause)
      track.removeEventListener('touchend', resume)
    }
  }, [photos.length])

  if (photos.length === 0) return null

  const formatDate = (d?: string) => {
    if (!d) return ''
    const dt = new Date(d + 'T00:00:00')
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
  }

  return (
    <>
      <div className="w-full flex-1 overflow-hidden relative">
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 px-4 md:px-8 h-full items-center will-change-transform"
        >
          {doubled.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className="flex-shrink-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] cursor-pointer group/card"
              onClick={() => setSelected(photo)}
            >
              <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-lg group-hover/card:shadow-2xl transition-shadow duration-300">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-white opacity-0 group-hover/card:opacity-40 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none">
                  <p className="text-white text-sm md:text-base font-medium">{photo.title}</p>
                  {photo.date && (
                    <p className="text-white/80 text-xs md:text-sm mt-1">{formatDate(photo.date)}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && createPortal(
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative rounded-2xl overflow-hidden max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto bg-white"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}
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
                <p className="text-sm text-gray-500 mt-1">{formatDate(selected.date)}</p>
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
