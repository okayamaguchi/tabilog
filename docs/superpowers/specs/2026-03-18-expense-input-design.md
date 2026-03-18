# 費用入力機能 設計仕様

**日付**: 2026-03-18
**ステータス**: 承認済み

---

## 概要

TOPページに「費用を入力」ボタンを追加し、入力フォームページ（`app/expenses/add/page.tsx`）で費用を記録する。入力データは localStorage に保存し、既存のモックデータと統合してダッシュボードに表示する。

---

## アーキテクチャ

### 技術的制約

`lib/expenses.ts` の集計関数は現在 Server Component（`app/page.tsx`）から直接呼ばれているが、localStorage はブラウザ専用。そのためダッシュボード部分をクライアントコンポーネントに移行する必要がある。

### 新規ファイル

| ファイル | 役割 |
|---------|------|
| `lib/localExpenses.ts` | localStorage の read/write ユーティリティ。キー `tabilog_expenses` |
| `components/ExpenseDashboard.tsx` | `'use client'` — localStorage読み込み・モックデータ統合・ダッシュボード全体のレンダリング |
| `app/expenses/add/page.tsx` | `'use client'` — 費用入力フォーム |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `lib/expenses.ts` | `getTotalSpent`・`getBudgetRemaining`・`getByCategory`・`getByDate` を配列引数型に変更 |
| `app/page.tsx` | インライン集計ロジック削除 → `<ExpenseDashboard />` に置き換え。「費用を入力」ボタン追加 |

---

## データ定義

### localStorage スキーマ

**キー:** `tabilog_expenses`
**値:** JSON 配列

```ts
type StoredExpense = {
  id: string       // crypto.randomUUID()
  date: string     // YYYY-MM-DD
  category: string // ExpenseCategory のいずれか
  amount: number
  memo: string
}
```

### `lib/localExpenses.ts`

```ts
import type { Expense } from './expenses'

const KEY = 'tabilog_expenses'

export function loadLocalExpenses(): Expense[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveLocalExpenses(expenses: Expense[]): void {
  localStorage.setItem(KEY, JSON.stringify(expenses))
}

export function addLocalExpense(expense: Expense): void {
  const existing = loadLocalExpenses()
  saveLocalExpenses([...existing, expense])
}
```

---

## `lib/expenses.ts` の変更

集計関数を配列引数型に変更し、`CATEGORIES` 定数を追加する。

**追加: `CATEGORIES` 定数（`ExpenseCategory` 型の直後に追加）:**

```ts
export const CATEGORIES: ExpenseCategory[] = [
  '交通費', '宿泊費', '食費', '観光', 'ショッピング', 'その他',
]
```

**変更: 全4集計関数を配列引数型に変更:**

```ts
export function getTotalSpent(arr: Expense[]): number {
  return arr.reduce((sum, e) => sum + e.amount, 0)
}

export function getBudgetRemaining(arr: Expense[]): number {
  return BUDGET - getTotalSpent(arr)
}

export function getByCategory(arr: Expense[]): { category: ExpenseCategory; total: number }[] {
  const map = new Map<ExpenseCategory, number>()
  for (const e of arr) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

export function getByDate(arr: Expense[]): { date: string; amount: number }[] {
  const map = new Map<string, number>()
  for (const e of arr) {
    map.set(e.date, (map.get(e.date) ?? 0) + e.amount)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, amount]) => ({ date, amount }))
}
```

---

## `components/ExpenseDashboard.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { expenses as mockExpenses, BUDGET, getTotalSpent, getBudgetRemaining, getByCategory, getByDate, type Expense } from '../lib/expenses'
import { loadLocalExpenses } from '../lib/localExpenses'
import ExpenseCharts from './ExpenseCharts'
// Note: ExpenseDashboard lives in components/ so ExpenseCharts import is './ExpenseCharts' (not '../components/ExpenseCharts')

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
  const byDate = getByDate(allExpenses)

  return (
    <>
      {/* Header row with button */}
      <div className="flex items-center justify-between mb-4">
        <div /> {/* spacer */}
        <Link
          href="/expenses/add"
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ background: '#4a7c59' }}
        >
          費用を入力
        </Link>
      </div>

      {/* Summary cards */}
      ...（既存のカード UI）

      <ExpenseCharts byCategory={byCategory} byDate={byDate} />
    </>
  )
}
```

**初期値 `mockExpenses`:** useEffect 前のSSR/ハイドレーション時にもデータが表示されるよう初期値にモックデータをセット。localStorage データは hydration 後に追加される。

---

## `app/expenses/add/page.tsx`

### UI 構成

```
┌────────────────────────────────┐
│  ← 戻る      費用を入力        │
├────────────────────────────────┤
│  日付         [2026-03-18    ] │
│  カテゴリ     [交通費        ▼]│
│  金額 (¥)    [              ] │
│  メモ         [              ] │
│                                │
│       [  保存する  ]           │
└────────────────────────────────┘
```

### バリデーション

- 金額: 必須、1以上の整数
- カテゴリ: 必須（デフォルト選択なし → プレースホルダー「選択してください」）
- 日付: 必須（デフォルト: 今日の日付）
- メモ: 任意

### インポート

```tsx
'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type Expense, type ExpenseCategory, CATEGORIES } from '../../../lib/expenses'
import { addLocalExpense } from '../../../lib/localExpenses'
```

> `CATEGORIES` は `lib/expenses.ts` にエクスポートする定数配列 `export const CATEGORIES: ExpenseCategory[] = ['交通費', '宿泊費', '食費', '観光', 'ショッピング', 'その他']`

### 保存処理

```ts
const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  const expense: Expense = {
    id: crypto.randomUUID(),
    date,
    category: category as ExpenseCategory,
    amount: Number(amount),
    memo,
  }
  addLocalExpense(expense)
  router.push('/')
}
```

### デザイン

- ページ全体: `max-w-md mx-auto px-4 py-10`
- ラベル: `text-sm text-gray-600`
- input/select: `w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2` + focus ring `#4a7c59`
- ボタン: セージグリーン背景、白文字、`w-full py-3 rounded-lg font-medium`
- 戻るリンク: `← 戻る` テキストリンク

---

## `app/page.tsx` の変更

- インライン集計ロジック（`getTotalSpent()`等の呼び出し）を削除
- `<ExpenseDashboard />` を `<header>` の直後に配置
- `VisitMap` セクションはそのまま維持

```tsx
import ExpenseDashboard from '../components/ExpenseDashboard'
import VisitMapWrapper from '../components/VisitMapWrapper'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 ...>tabilog</h1>
        <p ...>旅の費用トラッキング</p>
      </header>

      <ExpenseDashboard />

      {/* Visit map */}
      <section className="mt-10">...</section>
    </main>
  )
}
```

---

## モバイル対応

- `max-w-md` でフォームは自然にモバイルに収まる
- `grid grid-cols-2 gap-4` のサマリーカードは既存のレスポンシブ設定を維持
- 入力フィールドは `w-full` で全幅

---

## エラーハンドリング

- localStorage パースエラー: `try/catch` で空配列にフォールバック
- `typeof window === 'undefined'` ガード（SSR時は空配列）
- フォームバリデーション: HTML5 `required` + 金額の `min="1"` で最低限保証
