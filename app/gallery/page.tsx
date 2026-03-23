import { Suspense } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import PhotoGrid from '../../components/PhotoGrid'
import { getPhotoGallery } from '../../lib/photo'

export default async function GalleryPage() {
  const photos = await getPhotoGallery()

  return (
    <>
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
        <h2 className="text-base font-semibold mb-6" style={{ color: '#4a7c59' }}>
          📸 Photos
        </h2>
        <Suspense fallback={<p className="text-gray-400 text-center py-12">Loading...</p>}>
          <PhotoGrid photos={photos} />
        </Suspense>
      </main>
    </>
  )
}
