'use client'

import { useState } from 'react'
import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

type CategoryData = {
  category: string
  total: number
}

type DateData = {
  date: string
  amount: number
}

type Props = {
  byCategory?: CategoryData[]
  byDate?: DateData[]
}

const COLORS = [
  '#4a7c59',
  '#6fa882',
  '#95c4a8',
  '#bddece',
  '#d4ece0',
  '#b8d4c4',
]

const fmt = (v: number) => `¥${v.toLocaleString()}`

export default function ExpenseCharts({ byCategory, byDate }: Props) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const showPie = byCategory && byCategory.length > 0
  const showBar = byDate && byDate.length > 0

  return (
    <div className={showPie && showBar ? 'grid grid-cols-1 md:grid-cols-2 gap-8 mt-4' : 'mt-4'}>
      {showPie && (() => {
        const total = byCategory.reduce((s, d) => s + d.total, 0)
        return (
          <div>
            <div className="flex gap-8 items-stretch">
              {/* 左: カスタム分割バー */}
              <div className="w-1/2 flex flex-col justify-center">
                <div className="flex h-12" onMouseLeave={() => setHoveredCategory(null)}>
                  {byCategory.map((d, i) => {
                    const pct = (d.total / total) * 100
                    const isHovered = hoveredCategory === d.category
                    const isFirst = i === 0
                    const isLast = i === byCategory.length - 1
                    return (
                      <div
                        key={d.category}
                        className="relative flex-shrink-0 transition-[filter] duration-150"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: COLORS[i % COLORS.length],
                          filter: isHovered ? 'brightness(1.15)' : 'none',
                          borderRadius: isFirst ? '16px 0 0 16px' : isLast ? '0 16px 16px 0' : '0',
                        }}
                        onMouseEnter={() => setHoveredCategory(d.category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        {isHovered && (
                          <div
                            className="hidden md:block absolute z-10 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm shadow-lg whitespace-nowrap pointer-events-none"
                            style={{ bottom: '120%', left: '50%', transform: 'translateX(-50%)' }}
                          >
                            {d.category}: ¥{d.total.toLocaleString()} ({pct.toFixed(1)}%)
                            <div
                              className="absolute w-2 h-2 bg-gray-800 rotate-45"
                              style={{ bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 右: カテゴリリスト */}
              <ul className="w-1/2 flex-shrink-0 space-y-2.5 justify-center flex flex-col">
                {byCategory.map((d, i) => (
                  <li key={d.category} className="flex items-center gap-2 text-sm">
                    <span
                      className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="flex-1 text-gray-700">{d.category}</span>
                    <span className="font-semibold text-gray-900 font-poppins tabular-nums">
                      ¥{d.total.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })()}

      {showBar && (
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
            Daily Spending
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDate} margin={{ top: 4, right: 8, left: 16, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: '#9ca3af' }}
                angle={-45}
                textAnchor="end"
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={fmt}
                width={60}
              />
              <Tooltip
                formatter={(value) => [`¥${Number(value).toLocaleString()}`, 'Amount']}
                labelStyle={{ fontSize: 11 }}
              />
              <Bar dataKey="amount" fill="#4a7c59" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
