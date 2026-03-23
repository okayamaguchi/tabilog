'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'

export default function RecommendationFormPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [reason, setReason] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, country: '', reason, name }),
      })

      if (!res.ok) throw new Error('Failed')
      router.push('/?thanks=1')
    } catch {
      alert('送信に失敗しました。もう一度お試しください。')
      setSending(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/40 focus:border-[#4a7c59]'

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-lg font-bold mb-8" style={{ color: '#4a7c59' }}>
          🌍 おすすめ都市を教えて！
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">お名前 *</label>
          <input
            type="text"
            required
            placeholder="例: かんな"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">都市名 *</label>
          <input
            type="text"
            required
            placeholder="例: バルセロナ"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">おすすめ理由 *</label>
          <textarea
            required
            placeholder="例: ガウディ建築が素晴らしい！"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
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
            disabled={sending}
            className="flex-1 py-3 rounded-xl font-medium text-white text-sm disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4a7c59, #6ab87a)',
              boxShadow: '0 2px 10px rgba(74, 124, 89, 0.3)',
            }}
          >
            {sending ? '送信中...' : '送信する'}
          </button>
        </div>
      </form>
      </main>
    </>
  )
}
