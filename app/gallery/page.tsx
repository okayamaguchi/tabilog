import Link from 'next/link'
import { getPhotoGallery } from '../../lib/photos'
import GalleryGrid from '../../components/GalleryGrid'

type Props = {
  searchParams: Promise<{ city?: string }>
}

export default async function GalleryPage({ searchParams }: Props) {
  const { city } = await searchParams
  const notionPhotos = await getPhotoGallery()

  const mockPhotos = [
    { id: '1', title: 'Colosseum', city: 'Rome', date: '2026-03-08', photo: 'https://via.placeholder.com/300', note: '空港に着いた' },
    { id: '2', title: 'Bistecca', city: 'Panzano', date: '2026-03-13', photo: 'https://via.placeholder.com/300', note: 'ダリオのお店' },
  ]

  const allPhotos = notionPhotos.length > 0 ? notionPhotos : mockPhotos

  const pageTitle = city ? `${city} Photos` : 'All Photos'

  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm -mx-4 md:-mx-8 px-4 md:px-8 py-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: '#4a7c59' }}>
            tabilog
          </h1>
          <p className="text-sm text-gray-500">Kanna in Europe</p>
        </div>
      </header>

      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center bg-white shadow-md rounded-full px-4 py-2 hover:shadow-lg transition-shadow text-sm font-medium mb-6"
        style={{ color: '#4a7c59' }}
      >
        &larr; Back to Top
      </Link>

      {/* Page title */}
      <h2
        className="text-2xl font-bold mb-8"
        style={{ color: '#4a7c59' }}
      >
        {pageTitle}
      </h2>

      <GalleryGrid photos={allPhotos} initialCity={city} />
    </main>
  )
}
