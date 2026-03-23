'use client'

import Link from 'next/link'
import type { NewsItem } from '../lib/news'

const glassCard = {
  background: '#FFFFFF',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

const accentBtn = {
  background: '#FFFFFF',
  color: '#3a6348',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function NewsSection({ news }: { news: NewsItem[] }) {
  const isPublic = process.env.NEXT_PUBLIC_MODE === 'true'
  const items = news.slice(0, 3)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: '#4a7c59' }}>
          📢 お知らせ
        </h2>
        {!isPublic && (
          <Link
            href="/news/add"
            className="text-sm font-semibold px-5 py-3 min-h-[44px] flex items-center rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={accentBtn}
          >
            ✏️ Add
          </Link>
        )}
      </div>
      <div className="mb-12">
        {items.length === 0 ? (
          <div className="rounded-[20px] p-5 md:p-6" style={glassCard}>
            <p className="text-sm text-gray-400">お知らせはまだありません</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-[20px] px-5 py-4 hover:-translate-y-0.5 transition-all duration-200"
                style={glassCard}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(item.date)}</span>
                  <p className="text-sm text-gray-800 font-medium truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
