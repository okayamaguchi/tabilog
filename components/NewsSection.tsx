'use client'

import type { NewsItem } from '../lib/news'

const glassCard = {
  background: '#FFFFFF',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04)',
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function NewsSection({ news }: { news: NewsItem[] }) {
  const items = news.slice(0, 3)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl p-5 md:p-6" style={glassCard}>
        <p className="text-sm text-gray-400">お知らせはまだありません</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl px-5 py-4 hover:-translate-y-0.5 transition-all duration-200"
          style={glassCard}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 whitespace-nowrap">{formatDate(item.date)}</span>
            <p className="text-sm text-gray-800 font-medium truncate">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
