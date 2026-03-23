import Link from 'next/link'
import Header from '../components/Header'
import ExpenseDashboard from '../components/ExpenseDashboard'
import TravelGallery from '../components/TravelGallery'
import VisitMapWrapper from '../components/VisitMapWrapper'
import NewsSection from '../components/NewsSection'
import SnsLinks from '../components/SnsLinks'
import { getNotionPlaces } from '../lib/places'
import { getPhotoGallery } from '../lib/photo'
import { getNewsList } from '../lib/news'
import { getExpenses } from '../lib/expenses'
import { visits as mockVisits } from '../lib/visits'

function BackgroundImage() {
  const desktopBg = process.env.NEXT_PUBLIC_BACKGROUND_IMAGE_DESKTOP
  const mobileBg = process.env.NEXT_PUBLIC_BACKGROUND_IMAGE_MOBILE
  if (!desktopBg && !mobileBg) return null

  return (
    <div className="fixed inset-0 -z-10">
      {desktopBg && (
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${desktopBg})` }}
        />
      )}
      {mobileBg && (
        <div
          className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileBg})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}

export default async function Home() {
  const [notionPlaces, photos, news, expenses] = await Promise.all([
    getNotionPlaces(),
    getPhotoGallery(),
    getNewsList(),
    getExpenses(),
  ])
  const visits = notionPlaces.length > 0 ? notionPlaces : mockVisits

  return (
    <div className="min-h-screen relative">
      <BackgroundImage />

      <div className="relative z-10">
        <Header showClock />

        <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24 md:pt-12 pb-10">

          {/* 🌍 おすすめ都市 */}
          <div className="flex justify-center mb-10">
            <Link
              href="/recommendations/form"
              className="text-sm font-semibold px-6 py-3 min-h-[44px] flex items-center rounded-full text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #4a7c59, #6ab87a)',
                boxShadow: '0 2px 10px rgba(74, 124, 89, 0.3)',
              }}
            >
              🌍 おすすめ都市を教えて！
            </Link>
          </div>

          {/* 📢 お知らせ */}
          <div id="news">
            <NewsSection news={news} />
          </div>

          {/* 📸 記録 */}
          <div id="photos" className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: '#4a7c59' }}>
              📸 記録
            </h2>
            <div className="flex items-center gap-2">
              <Link
                href="/gallery"
                className="text-sm font-semibold px-5 py-3 min-h-[44px] flex items-center rounded-full text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #4a7c59, #6ab87a)',
                  boxShadow: '0 2px 10px rgba(74, 124, 89, 0.3)',
                }}
              >
                もっと見る
              </Link>
              {process.env.NEXT_PUBLIC_MODE !== 'true' && (
                <Link
                  href="/gallery/add"
                  className="text-sm font-semibold px-5 py-3 min-h-[44px] flex items-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: '#FFFFFF',
                    color: '#3a6348',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  ✏️ Add
                </Link>
              )}
            </div>
          </div>
          <TravelGallery photos={photos} />

          {/* 📍 旅路 */}
          <section id="places" className="relative z-0 mt-12">
            <h2 className="text-base font-semibold mb-4" style={{ color: '#4a7c59' }}>
              📍 旅路
            </h2>
            <div
              className="rounded-[20px] overflow-hidden"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <VisitMapWrapper visits={visits} />
            </div>
          </section>

          {/* 💰 Budget */}
          <div id="budget" className="mt-12">
            <ExpenseDashboard expenses={expenses} />
          </div>

        </main>

        {/* SNS Footer */}
        <footer className="py-8 flex flex-col items-center gap-3">
          <SnsLinks />
          <p className="text-xs text-gray-400">Kanna in Europe</p>
        </footer>
      </div>
    </div>
  )
}
