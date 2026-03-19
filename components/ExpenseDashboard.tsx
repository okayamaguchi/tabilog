'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  expenses as mockExpenses,
  BUDGET,
  getTotalSpent,
  getBudgetRemaining,
  getByCategory,
  type Expense,
} from '../lib/expenses'
import { loadLocalExpenses } from '../lib/localExpenses'
import ExpenseCharts from './ExpenseCharts'

export default function ExpenseDashboard() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>(mockExpenses)

  useEffect(() => {
    const local = loadLocalExpenses()
    if (local.length > 0) {
      setAllExpenses([...mockExpenses, ...local])
    }
  }, [])

  const totalSpent = getTotalSpent(allExpenses)
  const remaining = getBudgetRemaining(allExpenses)
  const usedPercent = Math.min((totalSpent / BUDGET) * 100, 100)
  const byCategory = getByCategory(allExpenses)

  return (
    <>
      {/* 見出し + ボタン */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: '#4a7c59' }}>💰 Budget</h2>
        <Link
          href="/expenses/add"
          className="text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-colors duration-200"
          style={{ background: '#4a7c59' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#81D4FA'
            ;(e.currentTarget as HTMLElement).style.color = '#1a4a6e'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = '#4a7c59'
            ;(e.currentTarget as HTMLElement).style.color = 'white'
          }}
        >
          ✏️ Add
        </Link>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-[32px] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 font-poppins">
            ¥{totalSpent.toLocaleString()}
          </p>
        </div>
        <div
          className="rounded-[32px] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          style={{
            background: remaining >= 0
              ? 'linear-gradient(135deg, #f0f7f3, #E3F2FD)'
              : '#fff0f0',
            border: `1.5px solid ${remaining >= 0 ? '#4a7c59' : '#ef4444'}`,
          }}
        >
          <p className="text-xs text-gray-400 mb-1">Remaining</p>
          <p
            className="text-2xl font-bold font-poppins"
            style={{ color: remaining >= 0 ? '#4a7c59' : '#ef4444' }}
          >
            {remaining >= 0 ? '' : '-'}¥{Math.abs(remaining).toLocaleString()}
          </p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>Progress</span>
          <span className="font-semibold font-poppins" style={{ color: '#4a7c59' }}>
            {usedPercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#E3F2FD' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${usedPercent}%`,
              background: usedPercent >= 90
                ? '#ef4444'
                : 'linear-gradient(90deg, #4a7c59, #81D4FA)',
            }}
          />
        </div>
      </div>

      {/* カテゴリ円グラフのみ（byDate は渡さない → 棒グラフ非表示） */}
      <ExpenseCharts byCategory={byCategory} />

      {/* 詳しく見るリンク */}
      <div className="flex justify-end mt-4">
        <Link
          href="/expenses"
          className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors duration-200"
          style={{ color: '#4a7c59', borderColor: '#4a7c59' }}
        >
          Details →
        </Link>
      </div>
    </>
  )
}
