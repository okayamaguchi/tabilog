# デザイン刷新 + /expenses ページ Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** tabilog 全体のデザインを刷新し（クリーム背景・丸みカード・Google Fonts・日記セクション）、新規 `/expenses` 詳細ページを実装する。

**Architecture:** 純粋な UI 変更のため自動テストは不要。各タスク後に `npm run dev` でブラウザ確認。変更は独立しており、依存順（CSS → ページ骨格 → コンポーネント → 新規ファイル）で実装する。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v3, Recharts v3, next/image

**Spec:** `docs/superpowers/specs/2026-03-19-design-refresh-design.md`

---

## File Structure

| ファイル | 操作 | 内容 |
|---------|------|------|
| `app/globals.css` | 変更 | `body` クリーム背景 + Noto Sans JP、`.font-poppins` クラス追加 |
| `app/layout.tsx` | 変更 | Google Fonts `<link>` 追加、`body` に `font-sans` クラス |
| `app/page.tsx` | 変更 | `max-w-[1400px]`、レスポンシブ padding、DiarySection 追加 |
| `components/ExpenseCharts.tsx` | 変更 | `byCategory?` / `byDate?` を optional 化、単独表示対応 |
| `components/VisitMap.tsx` | 変更 | `style` height → `className` レスポンシブ高さ |
| `components/ExpenseDashboard.tsx` | 変更 | 全面カードデザイン刷新、棒グラフ削除、「詳しく見る」リンク追加 |
| `components/DiarySection.tsx` | 新規 | Server Component。featured + 2列グリッド、hover brightness-75 |
| `app/expenses/page.tsx` | 新規 | `/expenses` Server Component ルート |
| `components/ExpensesPageContent.tsx` | 新規 | `'use client'`。棒グラフ + 費用一覧テーブル |

---

### Task 1: グローバル CSS + レイアウトにフォント追加

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

> **注意**: これは純粋なスタイル変更のため TDD の unit test は不要。ブラウザ確認で代替する。

- [ ] **Step 1: globals.css を次の内容に完全置換する**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #FDFCF8;
  font-family: 'Noto Sans JP', sans-serif;
}

.font-poppins {
  font-family: 'Poppins', sans-serif;
}
```

- [ ] **Step 2: layout.tsx を次の内容に完全置換する**

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'tabilog',
  description: '旅の記録',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: ビルドエラーがないか確認**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし（または既存のエラーと同じ）

- [ ] **Step 4: コミット**

```bash
cd /Users/kanna/tabilog
git add app/globals.css app/layout.tsx
git commit -m "style: add Google Fonts and cream background to global styles"
```

---

### Task 2: app/page.tsx のレイアウト更新

**Files:**
- Modify: `app/page.tsx`

> DiarySection はまだ存在しないため、このタスクでは一時的に import をコメントアウトしたまま page.tsx の構造を整える。Task 6 で DiarySection を作成した後にコメントを外す。

- [ ] **Step 1: app/page.tsx を次の内容に完全置換する**

```tsx
import ExpenseDashboard from '../components/ExpenseDashboard'
import VisitMapWrapper from '../components/VisitMapWrapper'
// DiarySection は Task 6 で追加

export default function Home() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#4a7c59' }}>
          tabilog
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
          旅の費用トラッキング
        </p>
      </header>

      <ExpenseDashboard />

      {/* DiarySection は Task 6 で追加 */}

      {/* 訪問した場所 */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
          訪問した場所
        </h2>
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <VisitMapWrapper />
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: TypeScript チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
cd /Users/kanna/tabilog
git add app/page.tsx
git commit -m "style: update page layout - max-width 1400px, responsive padding"
```

---

### Task 3: ExpenseCharts を optional props 対応に変更

**Files:**
- Modify: `components/ExpenseCharts.tsx`

> `byCategory` と `byDate` を両方 optional にし、それぞれ存在する場合のみグラフを描画する。これにより ExpenseDashboard は円グラフのみ、ExpensesPageContent は棒グラフのみ表示できる。

- [ ] **Step 1: components/ExpenseCharts.tsx を次の内容に完全置換する**

```tsx
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
```

- [ ] **Step 2: TypeScript チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
cd /Users/kanna/tabilog
git add components/ExpenseCharts.tsx
git commit -m "refactor: make byCategory and byDate optional in ExpenseCharts"
```

---

### Task 4: VisitMap のレスポンシブ高さ対応

**Files:**
- Modify: `components/VisitMap.tsx`

> `style={{ height: '400px', width: '100%' }}` を削除し、Tailwind className でレスポンシブ高さを制御する。Leaflet の MapContainer は `className` を受け付ける。

- [ ] **Step 1: components/VisitMap.tsx の MapContainer の style prop を className に変更する**

変更対象（`components/VisitMap.tsx:18-22`）:

**変更前:**
```tsx
    <MapContainer
      center={[47, 10]}
      zoom={4}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
```

**変更後:**
```tsx
    <MapContainer
      center={[47, 10]}
      zoom={4}
      className="h-[350px] md:h-[500px]"
      scrollWheelZoom={false}
    >
```

- [ ] **Step 2: TypeScript チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
cd /Users/kanna/tabilog
git add components/VisitMap.tsx
git commit -m "style: make VisitMap height responsive (350px mobile / 500px PC)"
```

---

### Task 5: ExpenseDashboard の全面デザイン刷新

**Files:**
- Modify: `components/ExpenseDashboard.tsx`

> 主な変更点:
> - カード: `rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]`
> - サマリーカード: 2列 → PC は 3列（3列目はミニバーグラフ）
> - 「費用を入力」ボタン: `rounded-full` + hover 水色（インライン onMouseEnter/Leave）
> - プログレスバー: white カードにラップ、グラデーション
> - `getByDate` の import を削除（棒グラフを渡さない）
> - `<ExpenseCharts byCategory={byCategory} />` のみ（byDate なし）
> - 「詳しく見る →」リンク追加

- [ ] **Step 1: components/ExpenseDashboard.tsx を次の内容に完全置換する**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  expenses as mockExpenses,
  BUDGET,
  getTotalSpent,
  getBudgetRemaining,
  getByCategory,
  type Expense,
} from '../lib/expenses'
import { loadLocalExpenses } from '../lib/localExpenses'
import ExpenseCharts from './ExpenseCharts'

export default function ExpenseDashboard() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>(mockExpenses)

  useEffect(() => {
    const local = loadLocalExpenses()
    if (local.length > 0) {
      setAllExpenses([...mockExpenses, ...local])
    }
  }, [])

  const totalSpent = getTotalSpent(allExpenses)
  const remaining = getBudgetRemaining(allExpenses)
  const usedPercent = Math.min((totalSpent / BUDGET) * 100, 100)
  const byCategory = getByCategory(allExpenses)

  return (
    <>
      {/* ボタン行 */}
      <div className="flex justify-end mb-4">
        <Link
          href="/expenses/add"
          className="text-sm font-semibold px-5 py-2.5 rounded-full text-white transition-colors duration-200"
          style={{ background: '#4a7c59' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#81D4FA'
            ;(e.currentTarget as HTMLElement).style.color = '#1a4a6e'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = '#4a7c59'
            ;(e.currentTarget as HTMLElement).style.color = 'white'
          }}
        >
          費用を入力
        </Link>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-gray-400 mb-1">総支出</p>
          <p className="text-2xl font-bold text-gray-900 font-poppins">
            ¥{totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">予算 ¥{BUDGET.toLocaleString()}</p>
        </div>
        <div
          className="rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          style={{
            background: remaining >= 0
              ? 'linear-gradient(135deg, #f0f7f3, #E3F2FD)'
              : '#fff0f0',
            border: `1.5px solid ${remaining >= 0 ? '#4a7c59' : '#ef4444'}`,
          }}
        >
          <p className="text-xs text-gray-400 mb-1">予算残高</p>
          <p
            className="text-2xl font-bold font-poppins"
            style={{ color: remaining >= 0 ? '#4a7c59' : '#ef4444' }}
          >
            {remaining >= 0 ? '' : '-'}¥{Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">使用率 {usedPercent.toFixed(1)}%</p>
        </div>
        {/* 3列目: PC のみ表示 */}
        <div className="hidden md:block rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
          <p className="text-xs text-gray-400 mb-1">カテゴリ内訳</p>
          <div className="flex items-end gap-1 h-9 mt-2">
            {byCategory.slice(0, 5).map((d, i) => {
              const max = byCategory[0]?.total ?? 1
              const pct = Math.max((d.total / max) * 100, 8)
              const colors = ['#4a7c59', '#81D4FA', '#6fa882', '#E3F2FD', '#95c4a8']
              return (
                <div
                  key={d.category}
                  className="flex-1 rounded-t-sm"
                  style={{ height: `${pct}%`, background: colors[i] }}
                  title={d.category}
                />
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {byCategory[0]?.category ?? ''}が最多
          </p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="mt-4 rounded-3xl bg-white p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>支出進捗</span>
          <span className="font-semibold font-poppins" style={{ color: '#4a7c59' }}>
            {usedPercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#E3F2FD' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${usedPercent}%`,
              background: usedPercent >= 90
                ? '#ef4444'
                : 'linear-gradient(90deg, #4a7c59, #81D4FA)',
            }}
          />
        </div>
      </div>

      {/* カテゴリ円グラフのみ（byDate は渡さない → 棒グラフ非表示） */}
      <ExpenseCharts byCategory={byCategory} />

      {/* 詳しく見るリンク */}
      <div className="flex justify-end mt-4">
        <Link
          href="/expenses"
          className="text-sm font-semibold px-4 py-2 rounded-full border transition-colors duration-200"
          style={{ color: '#4a7c59', borderColor: '#4a7c59' }}
        >
          詳しく見る →
        </Link>
      </div>
    </>
  )
}
```

- [ ] **Step 2: TypeScript チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
cd /Users/kanna/tabilog
git add components/ExpenseDashboard.tsx
git commit -m "style: redesign ExpenseDashboard with rounded cards, pill button, bar chart moved to /expenses"
```

---

### Task 6: DiarySection 新規作成 + page.tsx に追加

**Files:**
- Create: `components/DiarySection.tsx`
- Modify: `app/page.tsx`

> Server Component。`lib/posts.ts` の先頭を featured、残りを 2 列グリッドで表示。next/image の `fill` を使用するため親要素に `position: relative` が必要（Tailwind: `relative`）。

- [ ] **Step 1: components/DiarySection.tsx を新規作成する**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { posts } from '../lib/posts'

export default function DiarySection() {
  const [featured, ...rest] = posts

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
        旅の日記
      </h2>

      {/* Featured */}
      <Link href={`/posts/${featured.id}`} className="block group mb-3">
        <div className="relative rounded-3xl overflow-hidden h-[200px] md:h-[280px]">
          <Image
            src={featured.thumbnail}
            alt={featured.title}
            fill
            className="object-cover transition-[filter] duration-300 group-hover:brightness-75"
            sizes="(max-width: 768px) 100vw, 1400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full mb-2">
              最新の旅
            </span>
            <p className="text-white font-bold text-base md:text-xl leading-snug">
              {featured.title}
            </p>
            <p className="text-white/70 text-xs mt-1">
              {featured.location} · {featured.date}
            </p>
          </div>
        </div>
      </Link>

      {/* Small grid: 1col mobile, 2col PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rest.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block group">
            <div className="relative rounded-2xl overflow-hidden h-[140px]">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover transition-[filter] duration-300 group-hover:brightness-75"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="text-white font-semibold text-sm leading-snug">
                  {post.title}
                </p>
                <p className="text-white/70 text-xs mt-0.5">{post.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: app/page.tsx を DiarySection を含む最終形に更新する**

```tsx
import DiarySection from '../components/DiarySection'
import ExpenseDashboard from '../components/ExpenseDashboard'
import VisitMapWrapper from '../components/VisitMapWrapper'

export default function Home() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#4a7c59' }}>
          tabilog
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
          旅の費用トラッキング
        </p>
      </header>

      <ExpenseDashboard />

      <DiarySection />

      {/* 訪問した場所 */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
          訪問した場所
        </h2>
        <div className="rounded-3xl overflow-hidden shadow-sm">
          <VisitMapWrapper />
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 3: TypeScript チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし。next/image のドメイン警告が出ても TypeScript エラーでなければ OK。

- [ ] **Step 4: next.config のリモート画像パターン確認**

`next.config.ts`（または `next.config.js`）を確認し、Unsplash の画像（`images.unsplash.com`）が `remotePatterns` に含まれているか確認する。なければ追加する:

```bash
cat /Users/kanna/tabilog/next.config.ts 2>/dev/null || cat /Users/kanna/tabilog/next.config.js 2>/dev/null || cat /Users/kanna/tabilog/next.config.mjs 2>/dev/null
```

含まれていない場合は `next.config.ts` に以下を追加:
```ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}
```

- [ ] **Step 5: コミット**

```bash
cd /Users/kanna/tabilog
git add components/DiarySection.tsx app/page.tsx next.config.ts  # next.config を変更した場合のみ追加
git commit -m "feat: add DiarySection with featured post and 2-column grid"
```

---

### Task 7: /expenses 詳細ページ新規作成

**Files:**
- Create: `app/expenses/page.tsx`
- Create: `components/ExpensesPageContent.tsx`

> `app/expenses/add/page.tsx` がすでに存在するため、`app/expenses/page.tsx` を新規追加するだけ（ルートは自動で `/expenses` にマッピングされる）。

- [ ] **Step 1: components/ExpensesPageContent.tsx を新規作成する**

```tsx
'use client'

import { useEffect, useState } from 'react'
import {
  expenses as mockExpenses,
  getByDate,
  type Expense,
} from '../lib/expenses'
import { loadLocalExpenses } from '../lib/localExpenses'
import ExpenseCharts from './ExpenseCharts'

const CATEGORY_COLORS: Record<string, string> = {
  '交通費':      '#4a7c59',
  '宿泊費':      '#81D4FA',
  '食費':        '#6fa882',
  '観光':        '#95c4a8',
  'ショッピング': '#E3F2FD',
  'その他':      '#d4ece0',
}

export default function ExpensesPageContent() {
  const [allExpenses, setAllExpenses] = useState<Expense[]>(mockExpenses)

  useEffect(() => {
    const local = loadLocalExpenses()
    if (local.length > 0) {
      setAllExpenses([...mockExpenses, ...local])
    }
  }, [])

  const byDate = getByDate(allExpenses)
  const sorted = [...allExpenses].sort(
    (a, b) => b.date.localeCompare(a.date)
  )

  return (
    <>
      {/* 棒グラフのみ（byCategory は渡さない） */}
      <div className="rounded-3xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] mb-6">
        <ExpenseCharts byDate={byDate} />
      </div>

      {/* 費用一覧 */}
      <div className="rounded-3xl bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="grid grid-cols-[80px_90px_1fr_90px] gap-2 px-5 py-3 border-b border-gray-100">
          <span className="text-xs text-gray-400 font-semibold uppercase">日付</span>
          <span className="text-xs text-gray-400 font-semibold uppercase">カテゴリ</span>
          <span className="text-xs text-gray-400 font-semibold uppercase">メモ</span>
          <span className="text-xs text-gray-400 font-semibold uppercase text-right">金額</span>
        </div>
        {sorted.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-[80px_90px_1fr_90px] gap-2 px-5 py-3 border-b border-gray-50 last:border-0 items-center"
          >
            <span className="text-xs text-gray-500 font-poppins">{e.date}</span>
            <span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: CATEGORY_COLORS[e.category] ?? '#f3f4f6',
                  color: e.category === 'ショッピング' || e.category === 'その他'
                    ? '#4a7c59'
                    : 'white',
                }}
              >
                {e.category}
              </span>
            </span>
            <span className="text-sm text-gray-700 truncate">{e.memo}</span>
            <span className="text-sm font-semibold text-right font-poppins">
              ¥{e.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 2: app/expenses/page.tsx を新規作成する**

```tsx
import Link from 'next/link'
import ExpensesPageContent from '../../components/ExpensesPageContent'

export default function ExpensesPage() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
      <Link
        href="/"
        className="text-sm font-medium mb-6 inline-block"
        style={{ color: '#4a7c59' }}
      >
        ← TOPに戻る
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">費用詳細</h1>
      <ExpensesPageContent />
    </main>
  )
}
```

- [ ] **Step 3: TypeScript チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 4: コミット**

```bash
cd /Users/kanna/tabilog
git add app/expenses/page.tsx components/ExpensesPageContent.tsx
git commit -m "feat: add /expenses detail page with bar chart and expense list"
```

---

### Task 8: ローカル確認

> デプロイはしない。`npm run dev` でローカル確認のみ。

- [ ] **Step 1: 開発サーバー起動**

```bash
cd /Users/kanna/tabilog && npm run dev
```

Expected: `ready - started server on 0.0.0.0:3000`（エラーなし）

- [ ] **Step 2: TOPページ確認（PC）**

ブラウザで `http://localhost:3000` を開く。確認項目:
- ページ背景がクリーム色（`#FDFCF8`）になっている
- フォントが Noto Sans JP に変わっている
- max-width が広くなっている（以前の `max-w-3xl` より幅広）
- 費用サマリーが 3列（PC）で表示されている
- サマリーカードが丸みのある白カード（`rounded-3xl`）
- プログレスバーが白カードにラップされグラデーション
- 「費用を入力」ボタンが角丸ピル形
- 棒グラフが消えて円グラフのみ表示
- 「詳しく見る →」リンクが表示されている
- 日記セクションが費用ダッシュボードの下に表示されている
- 地図セクションが日記の下に表示されている
- 地図の高さが 500px になっている

- [ ] **Step 3: TOPページ確認（スマホ）**

ブラウザの DevTools > デバイスモード（幅 390px）で確認:
- サマリーカードが 2列
- 日記 Small grid が 1列縦積み
- 地図の高さが 350px になっている
- padding が `px-4` で適切な余白

- [ ] **Step 4: /expenses ページ確認**

ブラウザで `http://localhost:3000/expenses` を開く。確認項目:
- 「← TOPに戻る」リンクが表示されている
- 棒グラフ（日別支出推移）が表示されている
- 費用一覧テーブルが日付降順で表示されている
- カテゴリがカラーバッジで表示されている
- 「← TOPに戻る」リンクをクリックすると `/` に戻れる

- [ ] **Step 5: 「詳しく見る」リンクの動作確認**

TOPページの「詳しく見る →」をクリックし、`/expenses` ページに遷移することを確認。
