'use client'

import {
  BUDGET,
  getTotalSpent,
  getBudgetRemaining,
  getByCategory,
  type Expense,
} from '../lib/expenses'
import ExpenseCharts from './ExpenseCharts'

const glassCard = {
  background: '#FFFFFF',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
}


export default function ExpenseDashboard({ expenses }: { expenses: Expense[] }) {
  const totalSpent = getTotalSpent(expenses)
  const remaining = getBudgetRemaining(expenses)
  const usedPercent = Math.min((totalSpent / BUDGET) * 100, 100)
  const remainingPercent = Math.max(100 - usedPercent, 0)
  const byCategory = getByCategory(expenses)
  const isPublic = process.env.NEXT_PUBLIC_MODE === 'true'

  function getBudgetEmoji(pct: number) {
    if (pct >= 90) return '😊'
    if (pct >= 70) return '🙂'
    if (pct >= 50) return '😐'
    if (pct >= 30) return '😰'
    if (pct >= 10) return '😱'
    return '🥶'
  }

  if (isPublic) {
    return (
      <div className="text-center">
        <p className="text-7xl md:text-8xl font-bold text-gray-800 mb-4">
          {remainingPercent.toFixed(0)}%
        </p>
        <p className="text-xl text-gray-600">帰国までの予算</p>
        <p className="text-sm text-gray-400 mt-2">なくなったら帰国します</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-[20px] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200" style={glassCard}>
          <p className="text-xs text-gray-400 mb-1">💰 Total</p>
          <p className="text-2xl font-bold text-gray-900 font-poppins">
            ¥{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="rounded-[20px] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200" style={glassCard}>
          <p className="text-xs text-gray-400 mb-1">💵 Remaining</p>
          <p
            className="text-2xl font-bold font-poppins"
            style={{ color: remaining >= 0 ? '#4a7c59' : '#ef4444' }}
          >
            {remaining >= 0 ? '' : '-'}¥{Math.abs(remaining).toLocaleString()}
          </p>
        </div>
        <div className="rounded-[20px] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200" style={glassCard}>
          <p className="text-xs text-gray-400 mb-1">📊 Progress</p>
          <p
            className="text-2xl font-bold font-poppins"
            style={{ color: usedPercent >= 90 ? '#ef4444' : '#4a7c59' }}
          >
            {usedPercent.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Category */}
      <div className="mt-4 mb-12 rounded-[20px] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200" style={glassCard}>
        <p className="text-xs text-gray-400 mb-4">📂 Category</p>
        <ExpenseCharts byCategory={byCategory} />
      </div>
    </>
  )
}
