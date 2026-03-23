'use client'

import Link from 'next/link'
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

const gradientBtn = {
  background: 'linear-gradient(135deg, #4a7c59, #6ab87a)',
  boxShadow: '0 2px 10px rgba(74, 124, 89, 0.3)',
}

const accentBtn = {
  background: '#FFFFFF',
  color: '#3a6348',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
      <>
        <div className="mb-4">
          <h2 className="text-base font-semibold" style={{ color: '#4a7c59' }}>💰 帰国までの予算あと...</h2>
          <p className="text-sm mt-1" style={{ color: '#999' }}>管理サイトで日々かかったお金を入力しています</p>
        </div>
        <div className="rounded-[20px] p-6 md:p-8 mb-12 text-center" style={glassCard}>
          <p className="text-5xl mb-3">{getBudgetEmoji(remainingPercent)}</p>
          <p className="text-4xl font-bold font-poppins mb-2" style={{ color: '#4a7c59' }}>
            {remainingPercent.toFixed(0)}%
          </p>
          <p className="text-sm text-gray-400">なくなったら帰国します</p>
        </div>
      </>
    )
  }

  return (
    <>
      {/* 💪 Budget */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: '#4a7c59' }}>💪 Budget</h2>
        <div className="flex items-center gap-2">
          <Link
            href="/expenses"
            className="text-sm font-semibold px-5 py-3 min-h-[44px] flex items-center rounded-full text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={gradientBtn}
          >
            Details
          </Link>
          <Link
            href="/expenses/add"
            className="text-sm font-semibold px-5 py-3 min-h-[44px] flex items-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={accentBtn}
          >
            ✏️ Add
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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
