'use client'

import { useEffect, useState } from 'react'
import {
  expenses as mockExpenses,
  getByDate,
  type Expense,
} from '../lib/expenses'
import { loadLocalExpenses } from '../lib/localExpenses'
import ExpenseCharts from './ExpenseCharts'

const CATEGORY_COLORS: Record<string, string> = {
  '交通費':      '#4a7c59',
  '宿泊費':      '#81D4FA',
  '食費':        '#6fa882',
  '観光':        '#95c4a8',
  'ショッピング': '#E3F2FD',
  'その他':      '#d4ece0',
}

export default function ExpensesPageContent() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>(mockExpenses)

  useEffect(() => {
    const local = loadLocalExpenses()
    if (local.length > 0) {
      setAllExpenses([...mockExpenses, ...local])
    }
  }, [])

  const byDate = getByDate(allExpenses)
  const sorted = [...allExpenses].sort(
    (a, b) => b.date.localeCompare(a.date)
  )

  return (
    <>
      {/* 棒グラフのみ（byCategory は渡さない） */}
      <div className="rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] mb-6">
        <ExpenseCharts byDate={byDate} />
      </div>

      {/* 費用一覧 */}
      <div className="rounded-3xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="grid grid-cols-[80px_90px_1fr_90px] gap-2 px-5 py-3 border-b border-gray-100">
          <span className="text-xs text-gray-400 font-semibold uppercase">日付</span>
          <span className="text-xs text-gray-400 font-semibold uppercase">カテゴリ</span>
          <span className="text-xs text-gray-400 font-semibold uppercase">メモ</span>
          <span className="text-xs text-gray-400 font-semibold uppercase text-right">金額</span>
        </div>
        {sorted.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-[80px_90px_1fr_90px] gap-2 px-5 py-3 border-b border-gray-50 last:border-0 items-center"
          >
            <span className="text-xs text-gray-500 font-poppins">{e.date}</span>
            <span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: CATEGORY_COLORS[e.category] ?? '#f3f4f6',
                  color: e.category === 'ショッピング' || e.category === 'その他'
                    ? '#4a7c59'
                    : 'white',
                }}
              >
                {e.category}
              </span>
            </span>
            <span className="text-sm text-gray-700 truncate">{e.memo}</span>
            <span className="text-sm font-semibold text-right font-poppins">
              ¥{e.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
