import { BUDGET, getTotalSpent, getBudgetRemaining, getByCategory, getByDate } from '../lib/expenses'
import ExpenseCharts from '../components/ExpenseCharts'
import VisitMap from '../components/VisitMapWrapper'

export default function Home() {
  const totalSpent = getTotalSpent()
  const remaining = getBudgetRemaining()
  const usedPercent = Math.min((totalSpent / BUDGET) * 100, 100)
  const byCategory = getByCategory()
  const byDate = getByDate()

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

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 mb-1">総支出</p>
          <p className="text-2xl font-bold text-gray-900">
            ¥{totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">予算 ¥{BUDGET.toLocaleString()}</p>
        </div>
        <div
          className="rounded-xl border shadow-sm p-5"
          style={{
            borderColor: remaining >= 0 ? '#4a7c59' : '#ef4444',
            background: remaining >= 0 ? '#f0f7f3' : '#fff0f0',
          }}
        >
          <p className="text-xs text-gray-400 mb-1">予算残高</p>
          <p
            className="text-2xl font-bold"
            style={{ color: remaining >= 0 ? '#4a7c59' : '#ef4444' }}
          >
            {remaining >= 0 ? '' : '-'}¥{Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">使用率 {usedPercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${usedPercent}%`,
              background: usedPercent >= 90 ? '#ef4444' : '#4a7c59',
            }}
          />
        </div>
      </div>

      <ExpenseCharts byCategory={byCategory} byDate={byDate} />

      {/* Visit map */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
          訪問した場所
        </h2>
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <VisitMap />
        </div>
      </section>
    </main>
  )
}
