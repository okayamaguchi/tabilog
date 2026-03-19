# デザイン刷新 + /expenses ページ 設計仕様

**日付**: 2026-03-19
**ステータス**: 承認済み
**デプロイ**: ローカル確認のみ（`npm run dev`）

---

## 概要

tabilog 全体のデザインを刷新する。背景クリーム色・丸みあるカード・Google Fonts 導入。TOPページのレイアウト整理（日記セクション追加・棒グラフ移動）と、新規 `/expenses` 詳細ページを実装する。

---

## デザインシステム

### カラーパレット

| 用途 | 値 |
|------|----|
| ページ背景 | `#FDFCF8`（クリーム） |
| メインカラー | `#4a7c59`（セージグリーン） |
| アクセント（薄） | `#E3F2FD`（水色） |
| アクセント（濃） | `#81D4FA`（スカイブルー） |
| カード背景 | `#ffffff` |
| テキスト（主） | `#1a1a1a` |
| テキスト（補） | `#9ca3af` |

### フォント

- **本文・UI**: Noto Sans JP（Google Fonts, weight: 400/500/600/700）
- **数字**: Poppins（Google Fonts, weight: 500/600/700）— `.font-poppins` CSS クラスで適用

### カードスタイル

```
background: white
border-radius: 24px  (Tailwind: rounded-3xl)
box-shadow: 0 2px 16px rgba(0,0,0,0.06)
```

### ボタンスタイル

```
background: #4a7c59
color: white
border-radius: 9999px  (Tailwind: rounded-full)
padding: 10px 20px
font-weight: 600
hover: background #81D4FA, color #1a4a6e
transition: 0.2s
```

### レスポンシブブレークポイント

| 名称 | 条件 | max-width | padding |
|------|------|-----------|---------|
| PC | `768px` 以上 | `1400px` | `px-8` |
| モバイル | `768px` 未満 | `100%` | `px-4` |

---

## ファイル構成

### 新規作成

| ファイル | 役割 |
|---------|------|
| `components/DiarySection.tsx` | 日記グリッド（Server Component）。`lib/posts.ts` からデータ取得 |
| `app/expenses/page.tsx` | `/expenses` ルート（Server Component）。`ExpensesPageContent` を描画 |
| `components/ExpensesPageContent.tsx` | `'use client'` — 日別棒グラフ + 費用一覧テーブル |

### 変更

| ファイル | 変更内容 |
|---------|---------|
| `app/layout.tsx` | Google Fonts `<link>` 追加、`body` に `.font-sans` クラス |
| `app/globals.css` | `body` 背景 `#FDFCF8`、`.font-poppins` クラス定義 |
| `app/page.tsx` | `max-w-3xl` → `max-w-[1400px]`、レスポンシブ padding、DiarySection 追加、VisitMap セクション維持 |
| `components/ExpenseDashboard.tsx` | カードスタイル刷新、ピルボタン、棒グラフ削除 → 「詳しく見る」リンク |
| `components/ExpenseCharts.tsx` | `byDate` を optional に変更（`byDate?`）。未指定時は棒グラフを非表示 |
| `components/VisitMap.tsx` | `style={{ height: '400px' }}` をレスポンシブ className に変更 |

---

## 各ファイルの実装詳細

### `app/layout.tsx`

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

---

### `app/globals.css`

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

---

### `app/page.tsx`

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

---

### `components/ExpenseDashboard.tsx`

主な変更点：
- カード: `rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]`
- サマリーカード: モバイル2列 → PC3列（`grid-cols-2 md:grid-cols-3`）。3列目はカテゴリ別ミニバーグラフ
- 「費用を入力」ボタン: `rounded-full` + hover 水色
- `<ExpenseCharts>` の呼び出し変更: `byDate` を渡さない（`byCategory` のみ）
- 「詳しく見る →」リンクを `<ExpenseCharts>` の下に追加

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
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#81D4FA'; (e.currentTarget as HTMLElement).style.color = '#1a4a6e' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#4a7c59'; (e.currentTarget as HTMLElement).style.color = 'white' }}
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
              const colors = ['#4a7c59','#81D4FA','#6fa882','#E3F2FD','#95c4a8']
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

> **注意**: `onMouseEnter`/`onMouseLeave` はインラインイベントハンドラで hover 色変更。Tailwind の `hover:` クラスはインラインスタイルと競合するため回避。

---

### `components/ExpenseCharts.tsx`

`byCategory` と `byDate` を両方 optional に変更。それぞれ存在する場合のみ対応セクションを描画。

```tsx
type Props = {
  byCategory?: CategoryData[]  // optional に変更
  byDate?: DateData[]          // optional に変更
}
```

JSX の構造:
```tsx
const showPie = byCategory && byCategory.length > 0
const showBar = byDate && byDate.length > 0

return (
  <div className={
    showPie && showBar
      ? 'grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'
      : 'mt-8'
  }>
    {showPie && (
      <div>
        {/* 既存の円グラフ実装 */}
      </div>
    )}
    {showBar && (
      <div>
        {/* 既存の棒グラフ実装 */}
      </div>
    )}
  </div>
)
```

これにより:
- `ExpenseDashboard`: `byCategory` のみ渡す → 円グラフのみ表示
- `ExpensesPageContent`: `byDate` のみ渡す → 棒グラフのみ表示

---

### `components/VisitMap.tsx`

`style={{ height: '400px' }}` を削除し、親から渡す className で制御:

```tsx
<MapContainer
  center={[47, 10]}
  zoom={4}
  className="h-[350px] md:h-[500px]"
  scrollWheelZoom={false}
>
```

> Leaflet の `MapContainer` は `style` だけでなく `className` も受け付ける。

---

### `components/DiarySection.tsx`（新規）

Server Component。`lib/posts.ts` から全投稿を取得し描画。

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

---

### `app/expenses/page.tsx`（新規）

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

---

### `components/ExpensesPageContent.tsx`（新規）

`'use client'`。localStorage + モックデータをマージし、棒グラフと費用一覧を表示。

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

> **`ExpenseCharts` 棒グラフのみ表示**: `byCategory={[]}` を渡すと円グラフは空データになる。`byDate` を渡すと棒グラフが表示される。グリッドは `byDate` のみの場合に `mt-8` のみになる（spec の `ExpenseCharts` 修正に依存）。

---

## レスポンシブ対応サマリー

| 要素 | モバイル（〜767px） | PC（768px〜） |
|------|---------------------|--------------|
| ページ max-width | 100% | 1400px |
| ページ padding | `px-4` | `px-8` |
| サマリーカード列数 | 2列 | 3列 |
| 日記 Small grid | 1列 | 2列 |
| マップ高さ | 350px | 500px |
| Featured 画像高さ | 200px | 280px |

---

## 検証手順

```bash
npm run dev
# http://localhost:3000 でTOPページ確認
# http://localhost:3000/expenses で詳細ページ確認
# ブラウザDev Tools > デバイスモードでモバイル表示確認
```
