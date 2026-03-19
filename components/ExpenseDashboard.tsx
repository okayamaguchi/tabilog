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
      {/* 💰 Budget タイトル + ボタン（カード外） */}
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

      {/* Budget 白カード: 4カラムグリッド */}
      <div className="bg-white rounded-[32px] shadow-sm p-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-[32px] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <p className="text-xs text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900 font-poppins">
              ¥{totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <p className="text-xs text-gray-400 mb-1">Remaining</p>
            <p
              className="text-2xl font-bold font-poppins"
              style={{ color: remaining >= 0 ? '#4a7c59' : '#ef4444' }}
            >
              {remaining >= 0 ? '' : '-'}¥{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
            <p className="text-xs text-gray-400 mb-1">Progress</p>
            <p
              className="text-2xl font-bold font-poppins"
              style={{ color: usedPercent >= 90 ? '#ef4444' : '#4a7c59' }}
            >
              {usedPercent.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-[32px] bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col">
            <p className="text-xs text-gray-400 mb-3">Category</p>
            <div className="flex-1">
              <ExpenseCharts byCategory={byCategory} />
            </div>
            <div className="flex justify-end mt-3">
              <Link
                href="/expenses"
                className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors duration-200"
                style={{ color: '#4a7c59', borderColor: '#4a7c59' }}
              >
                Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
