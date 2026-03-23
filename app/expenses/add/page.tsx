'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'
import { CATEGORIES } from '../../../lib/expenses'

export default function AddExpensePage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, category, amount: Number(amount), memo }),
      })

      if (!res.ok) throw new Error('Failed to save')
      router.push('/')
    } catch {
      alert('保存に失敗しました。もう一度お試しください。')
      setSaving(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/40 focus:border-[#4a7c59]'

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-lg font-bold mb-8" style={{ color: '#4a7c59' }}>
          💰 支出を追加
        </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">日付 *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">カテゴリ *</label>
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">金額（¥） *</label>
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            メモ <span className="text-gray-400">(任意)</span>
          </label>
          <textarea
            placeholder="例: ランチ代"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 rounded-xl font-medium text-sm text-center border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-medium text-white text-sm disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4a7c59, #6ab87a)',
              boxShadow: '0 2px 10px rgba(74, 124, 89, 0.3)',
            }}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
      </main>
    </>
  )
}
