'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  expenses as mockExpenses,
  BUDGET,
  getTotalSpent,
  getBudgetRemaining,
  getByCategory,
  getByDate,
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
  const byDate = getByDate(allExpenses)

  return (
    <>
      {/* 費用を入力ボタン */}
      <div className="flex justify-end mb-4">
        <Link
          href="/expenses/add"
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ background: '#4a7c59' }}
        >
          費用を入力
        </Link>
      </div>

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
    </>
  )
}
