'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type Expense, type ExpenseCategory, CATEGORIES } from '../../../lib/expenses'
import { addLocalExpense } from '../../../lib/localExpenses'

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  return Math.round((e - s) / (1000 * 60 * 60 * 24))
}

export default function AddExpensePage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const totalAmount = Number(amount)
    const hasRange = endDate && endDate > date

    if (hasRange) {
      const days = daysBetween(date, endDate) + 1
      const perDay = Math.round(totalAmount / days)
      for (let i = 0; i < days; i++) {
        addLocalExpense({
          id: crypto.randomUUID(),
          date: addDays(date, i),
          category: category as ExpenseCategory,
          amount: perDay,
          memo,
        })
      }
    } else {
      addLocalExpense({
        id: crypto.randomUUID(),
        date,
        category: category as ExpenseCategory,
        amount: totalAmount,
        memo,
      })
    }
    router.push('/')
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700'

  const hasRange = endDate && endDate > date
  const days = hasRange ? daysBetween(date, endDate) + 1 : null
  const perDay = days && Number(amount) ? Math.round(Number(amount) / days) : null

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
        <h1 className="text-lg font-bold" style={{ color: '#4a7c59' }}>
          Add Expense
        </h1>
        <div className="w-12" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Start Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date <span className="text-gray-400">(optional)</span></label>
          <input
            type="date"
            value={endDate}
            min={date}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
          {hasRange && perDay && (
            <p className="text-xs text-gray-400 mt-1">
              {days} days · ¥{perDay.toLocaleString()} / day
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Amount (¥)</label>
          <input
            type="number"
            required
            min="1"
            step="1"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Note <span className="text-gray-400">(optional)</span></label>
          <input
            type="text"
            placeholder="e.g. Lunch at café"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white mt-6"
          style={{ background: '#4a7c59' }}
        >
          Save
        </button>
      </form>
    </main>
  )
}
