'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../components/Header'

export default function AddNewsPage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [title, setTitle] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date }),
      })

      if (!res.ok) throw new Error('Failed to save')
      router.push('/')
    } catch {
      alert('保存に失敗しました。もう一度お試しください。')
      setSaving(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700'

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-lg font-bold mb-8" style={{ color: '#4a7c59' }}>
        お知らせを追加
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <div>
          <label className="block text-sm text-gray-600 mb-1">タイトル</label>
          <input
            type="text"
            required
            placeholder="例: ローマに到着！"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-lg font-medium text-white mt-6 disabled:opacity-50"
          style={{ background: '#4a7c59' }}
        >
          {saving ? '保存中...' : '保存'}
        </button>
      </form>
      </main>
    </>
  )
}
