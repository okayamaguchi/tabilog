'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type Expense, type ExpenseCategory, CATEGORIES } from '../../../lib/expenses'
import { addLocalExpense } from '../../../lib/localExpenses'

export default function AddExpensePage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const expense: Expense = {
      id: crypto.randomUUID(),
      date,
      category: category as ExpenseCategory,
      amount: Number(amount),
      memo,
    }
    addLocalExpense(expense)
    router.push('/')
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700'

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 戻る
        </Link>
        <h1 className="text-lg font-bold" style={{ color: '#4a7c59' }}>
          費用を入力
        </h1>
        <div className="w-12" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 日付 */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">日付</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">カテゴリ</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>選択してください</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 金額 */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">金額 (¥)</label>
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

        {/* メモ */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">メモ（任意）</label>
          <input
            type="text"
            placeholder="例: カフェでランチ"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* 保存ボタン */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white mt-6"
          style={{ background: '#4a7c59' }}
        >
          保存する
        </button>
      </form>
    </main>
  )
}
