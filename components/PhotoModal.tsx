'use client'

import { useEffect, useCallback } from 'react'
import type { PhotoItem } from '../lib/photos'

type Props = {
  photo: PhotoItem
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}

export default function PhotoModal({ photo, onClose, onPrev, onNext }: Props) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    },
    [onClose, onPrev, onNext],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light z-10"
      >
        &times;
      </button>

      {/* Prev */}
      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10"
        >
          &#8249;
        </button>
      )}

      {/* Next */}
      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10"
        >
          &#8250;
        </button>
      )}

      {/* Image + caption */}
      <div
        className="flex flex-col items-center max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.photo}
          alt={photo.note || photo.title}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <div className="mt-3 text-center">
          <p className="text-white font-semibold">{photo.title}</p>
          {photo.note && (
            <p className="text-white/70 text-sm mt-1">{photo.note}</p>
          )}
          {photo.date && (
            <p className="text-white/50 text-xs mt-1">{photo.date}</p>
          )}
        </div>
      </div>
    </div>
  )
}
