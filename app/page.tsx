import ExpenseDashboard from '../components/ExpenseDashboard'
import VisitMapWrapper from '../components/VisitMapWrapper'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#4a7c59' }}>
          tabilog
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
          旅の費用トラッキング
        </p>
      </header>

      <ExpenseDashboard />

      {/* Visit map */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
          訪問した場所
        </h2>
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <VisitMapWrapper />
        </div>
      </section>
    </main>
  )
}
