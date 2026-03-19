'use client'

import {
  PieChart,
  Pie,
  Cell,
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
  '#e8f5ee',
]

const fmt = (v: number) =>
  v >= 10000
    ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)}万`
    : `${v.toLocaleString()}`

export default function ExpenseCharts({ byCategory, byDate }: Props) {
  const showPie = byCategory && byCategory.length > 0
  const showBar = byDate && byDate.length > 0

  return (
    <div className={showPie && showBar ? 'grid grid-cols-1 md:grid-cols-2 gap-8 mt-8' : 'mt-8'}>
      {showPie && (
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
            カテゴリ別支出
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }: { name?: string; percent?: number }) =>
                  `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`¥${Number(value).toLocaleString()}`, '金額']}
                position={{ x: 4, y: 4 }}
                wrapperStyle={{ maxWidth: '155px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <ul className="mt-3 space-y-1">
            {byCategory.map((d, i) => (
              <li key={d.category} className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {d.category}
                </span>
                <span className="font-medium text-gray-800">¥{d.total.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showBar && (
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
            日別支出推移
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDate} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
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
                width={40}
              />
              <Tooltip
                formatter={(value) => [`¥${Number(value).toLocaleString()}`, '支出']}
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
