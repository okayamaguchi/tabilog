'use client'

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
  '#e8f5ee',
]

const GRADIENTS: [string, string][] = [
  ['#2e4a38', '#4a7c59'],
  ['#4a7c59', '#6fa882'],
  ['#6fa882', '#95c4a8'],
  ['#95c4a8', '#bddece'],
  ['#bddece', '#d4ece0'],
  ['#d4ece0', '#e8f5ee'],
]

const fmt = (v: number) =>
  v >= 10000
    ? `${(v / 10000).toFixed(v % 10000 === 0 ? 0 : 1)}万`
    : `${v.toLocaleString()}`

export default function ExpenseCharts({ byCategory, byDate }: Props) {
  const showPie = byCategory && byCategory.length > 0
  const showBar = byDate && byDate.length > 0

  return (
    <div className={showPie && showBar ? 'grid grid-cols-1 md:grid-cols-2 gap-8 mt-4' : 'mt-4'}>
      {showPie && (
        <div>
          {/* 2カラム: 左=積み上げ横棒グラフ、右=カテゴリリスト */}
          <div className="flex gap-8 items-stretch">
            {/* 左: 積み上げ横棒グラフ */}
            <div className="w-1/2 flex flex-col justify-center">
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={[byCategory.reduce<Record<string, number>>(
                    (acc, d) => ({ ...acc, [d.category]: d.total }), {}
                  )]}
                  layout="vertical"
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    {byCategory.map((_, i) => (
                      <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={GRADIENTS[i % GRADIENTS.length][0]} />
                        <stop offset="100%" stopColor={GRADIENTS[i % GRADIENTS.length][1]} />
                      </linearGradient>
                    ))}
                  </defs>
                  <XAxis type="number" hide />
                  <YAxis type="category" hide width={0} />
                  {byCategory.map((d, i) => (
                    <Bar
                      key={d.category}
                      dataKey={d.category}
                      stackId="stack"
                      fill={`url(#grad-${i})`}
                      radius={
                        i === 0
                          ? [4, 0, 0, 4]
                          : i === byCategory.length - 1
                          ? [0, 4, 4, 0]
                          : [0, 0, 0, 0]
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* 右: カテゴリリスト */}
            <ul className="w-1/2 flex-shrink-0 space-y-2.5 justify-center flex flex-col">
              {byCategory.map((d, i) => (
                <li key={d.category} className="flex items-center gap-2 text-sm">
                  <span
                    className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                    style={{
                      background: `linear-gradient(to right, ${GRADIENTS[i % GRADIENTS.length][0]}, ${GRADIENTS[i % GRADIENTS.length][1]})`,
                    }}
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
