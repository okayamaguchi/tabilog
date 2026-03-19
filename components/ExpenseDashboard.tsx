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
      {/* 💰 Budget */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold" style={{ color: '#4a7c59' }}>💰 Budget</h2>
        <div className="flex items-center gap-2">
          <Link
            href="/expenses"
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
            Details
          </Link>
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
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-[32px] bg-white p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <p className="text-xs text-gray-400 mb-1">💰 Total</p>
          <p className="text-2xl font-bold text-gray-900 font-poppins">
            ¥{totalSpent.toLocaleString()}
          </p>
        </div>
        <div className="rounded-[32px] bg-white p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
          <p className="text-xs text-gray-400 mb-1">💵 Remaining</p>
          <p
            className="text-2xl font-bold font-poppins"
            style={{ color: remaining >= 0 ? '#4a7c59' : '#ef4444' }}
          >
            {remaining >= 0 ? '' : '-'}¥{Math.abs(remaining).toLocaleString()}
          </p>
        </div>
        <div className="rounded-[32px] bg-white p-5 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
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
      <div className="mt-4 rounded-[32px] bg-white p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
        <p className="text-xs text-gray-400 mb-4">📂 Category</p>
        <ExpenseCharts byCategory={byCategory} />
      </div>
    </>
  )
}
