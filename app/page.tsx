import Link from 'next/link'
import Header from '../components/Header'
import SectionScroll from '../components/SectionScroll'
import SideNavigation from '../components/SideNavigation'
import SocialIcons from '../components/SocialIcons'
import ExpenseDashboard from '../components/ExpenseDashboard'
import TravelGallery from '../components/TravelGallery'
import VisitMapWrapper from '../components/VisitMapWrapper'
import NewsSection from '../components/NewsSection'
import { getNotionPlaces } from '../lib/places'
import { getPhotoGallery } from '../lib/photo'
import { getNewsList } from '../lib/news'
import { getExpenses } from '../lib/expenses'
import { visits as mockVisits } from '../lib/visits'

const isEditMode = process.env.NEXT_PUBLIC_MODE !== 'true'

export default async function Home() {
  const [notionPlaces, photos, news, expenses] = await Promise.all([
    getNotionPlaces(),
    getPhotoGallery(),
    getNewsList(),
    getExpenses(),
  ])
  const visits = notionPlaces.length > 0 ? notionPlaces : mockVisits
  const desktopBg = process.env.NEXT_PUBLIC_BACKGROUND_IMAGE_DESKTOP
  const mobileBg = process.env.NEXT_PUBLIC_BACKGROUND_IMAGE_MOBILE

  return (
    <>
      <Header />
      <SideNavigation />
      <SocialIcons />

      <SectionScroll>
        <main>
          {/* Section 1: おすすめ都市（背景画像あり） */}
          <section className="h-screen relative flex items-center justify-center">
            {desktopBg && (
              <div
                className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: `url(${desktopBg})` }}
              />
            )}
            {mobileBg && (
              <div
                className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: `url(${mobileBg})` }}
              />
            )}
            <div className="absolute inset-0 bg-black/20 -z-10" />

            <div className="relative z-10 w-full max-w-2xl mx-auto px-4 text-center">
              <Link
                href="/recommendations/form"
                className="inline-flex text-sm font-semibold px-8 py-3 items-center rounded-full text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                おすすめ都市を教えて →
              </Link>
            </div>
          </section>

          {/* Section 2: お知らせ */}
          <section id="news" className="h-screen flex flex-col items-center justify-center py-16 px-4 bg-[#FAFAFA]">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">お知らせ</h2>

            <div className="w-full max-w-4xl flex-1 overflow-y-auto px-4">
              <NewsSection news={news} />
            </div>

            {isEditMode && (
              <div className="flex gap-4 mt-8">
                <Link
                  href="/news/add"
                  className="px-8 py-3 bg-white border-2 border-[#4a7c59] text-[#4a7c59] rounded-full hover:bg-gray-50 transition flex items-center gap-2"
                >
                  ✏️ Add
                </Link>
              </div>
            )}
          </section>

          {/* Section 3: 記録（写真） */}
          <section id="photos" className="h-screen flex flex-col items-center justify-center py-8 md:py-16 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 px-4">記録</h2>

            <TravelGallery photos={photos} />

            <div className="flex gap-4 mt-8">
              <Link
                href="/gallery"
                className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition flex items-center gap-2"
              >
                View More →
              </Link>
              {isEditMode && (
                <Link
                  href="/gallery/add"
                  className="px-8 py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-50 transition flex items-center gap-2"
                >
                  ✏️ Add
                </Link>
              )}
            </div>
          </section>

          {/* Section 4: 旅路（Places） */}
          <section id="places" className="h-screen flex flex-col items-center justify-center py-8 md:py-16 px-4 bg-[#FAFAFA]">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8">旅路</h2>

            <div className="w-full max-w-[1400px] h-[60vh] md:flex-1 min-h-0 overflow-hidden rounded-2xl shadow-lg">
              <VisitMapWrapper visits={visits} />
            </div>
          </section>

          {/* Section 5: 予算 */}
          <section id="budget" className="h-screen flex flex-col items-center justify-center py-16 px-4 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">予算</h2>

            <div className="w-full max-w-4xl flex-1 overflow-y-auto px-4 flex items-center justify-center">
              <div className="w-full">
                <ExpenseDashboard expenses={expenses} />
              </div>
            </div>

            {isEditMode && (
              <div className="flex gap-4 mt-8">
                <Link
                  href="/expenses"
                  className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition flex items-center gap-2"
                >
                  View More →
                </Link>
                <Link
                  href="/expenses/add"
                  className="px-8 py-3 bg-white border-2 border-gray-800 text-gray-800 rounded-full hover:bg-gray-50 transition flex items-center gap-2"
                >
                  ✏️ Add
                </Link>
              </div>
            )}
          </section>

        </main>
      </SectionScroll>
    </>
  )
}
