import DiarySection from '../components/DiarySection'
import ExpenseDashboard from '../components/ExpenseDashboard'
import VisitMapWrapper from '../components/VisitMapWrapper'

export default function Home() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-bold" style={{ color: '#4a7c59' }}>
          tabilog
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Every Yen I Spent Traveling
        </p>
      </header>

      <ExpenseDashboard />

      <DiarySection />

      {/* 訪問した場所 */}
      <section className="mt-12">
        <h2 className="text-base font-semibold mb-4" style={{ color: '#4a7c59' }}>
          📍 Places
        </h2>
        <div className="rounded-[32px] overflow-hidden shadow-sm">
          <VisitMapWrapper />
        </div>
      </section>
    </main>
  )
}
