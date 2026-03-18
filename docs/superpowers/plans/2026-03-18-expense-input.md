# 費用入力機能 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** localStorage に費用データを保存し、モックデータと統合してダッシュボードに表示する費用入力機能を追加する。

**Architecture:** `lib/expenses.ts` の集計関数を配列引数型に変更し、`lib/localExpenses.ts` で localStorage を管理。`components/ExpenseDashboard.tsx`（`'use client'`）が localStorage とモックデータを統合してダッシュボードをレンダリング。`app/expenses/add/page.tsx` が入力フォームを提供し、保存後 TOP へリダイレクト。

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, localStorage

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `lib/expenses.ts` | CATEGORIES 定数追加、4関数を配列引数型に変更 |
| Create | `lib/localExpenses.ts` | localStorage read/write ユーティリティ |
| Create | `components/ExpenseDashboard.tsx` | `'use client'` ダッシュボード（localStorage+モック統合） |
| Create | `app/expenses/add/page.tsx` | `'use client'` 費用入力フォーム |
| Modify | `app/page.tsx` | インライン集計削除 → ExpenseDashboard に置き換え |

---

### Task 1: `lib/expenses.ts` の更新

**Files:**
- Modify: `lib/expenses.ts`

現在の `lib/expenses.ts` の全4関数（`getTotalSpent`, `getBudgetRemaining`, `getByCategory`, `getByDate`）は引数なしでモジュールスコープの `expenses` 配列を直接参照している。これを配列引数型に変更し、`CATEGORIES` 定数を追加する。

- [ ] **Step 1: `lib/expenses.ts` を読み込んで現在の内容を確認**

```bash
cat /Users/kanna/tabilog/lib/expenses.ts
```

- [ ] **Step 2: `ExpenseCategory` 型の定義直後に `CATEGORIES` 定数を追加**

`ExpenseCategory` 型（7行目）の直後、`Expense` 型の前に以下を挿入する:

```ts
export const CATEGORIES: ExpenseCategory[] = [
  '交通費', '宿泊費', '食費', '観光', 'ショッピング', 'その他',
]
```

- [ ] **Step 3: 4つの集計関数を配列引数型に変更**

既存の `getTotalSpent`, `getBudgetRemaining`, `getByCategory`, `getByDate` 関数を以下の実装で置き換える（`expenses` 変数の直接参照を `arr` 引数に変更）:

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

- [ ] **Step 4: TypeScript 型チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし（ただし `app/page.tsx` で旧関数シグネチャを使っているためエラーが出る場合があるが、それは Task 5 で修正する）

- [ ] **Step 5: コミット**

```bash
git add lib/expenses.ts
git commit -m "refactor: make expense aggregate functions accept array argument"
```

---

### Task 2: `lib/localExpenses.ts` の作成

**Files:**
- Create: `lib/localExpenses.ts`

- [ ] **Step 1: `lib/localExpenses.ts` を作成**

```ts
import type { Expense } from './expenses'

const KEY = 'tabilog_expenses'

export function loadLocalExpenses(): Expense[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Expense[]
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

- [ ] **Step 2: TypeScript 型チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add lib/localExpenses.ts
git commit -m "feat: add localStorage expense utilities"
```

---

### Task 3: `components/ExpenseDashboard.tsx` の作成

**Files:**
- Create: `components/ExpenseDashboard.tsx`

ダッシュボード UI 全体（サマリーカード、プログレスバー、チャート）をクライアントコンポーネントとして実装する。useEffect で localStorage を読み込み、モックデータとマージする。

- [ ] **Step 1: `components/ExpenseDashboard.tsx` を作成**

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
  getByDate,
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
  const byDate = getByDate(allExpenses)

  return (
    <>
      {/* 費用を入力ボタン */}
      <div className="flex justify-end mb-4">
        <Link
          href="/expenses/add"
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ background: '#4a7c59' }}
        >
          費用を入力
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-400 mb-1">総支出</p>
          <p className="text-2xl font-bold text-gray-900">
            ¥{totalSpent.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">予算 ¥{BUDGET.toLocaleString()}</p>
        </div>
        <div
          className="rounded-xl border shadow-sm p-5"
          style={{
            borderColor: remaining >= 0 ? '#4a7c59' : '#ef4444',
            background: remaining >= 0 ? '#f0f7f3' : '#fff0f0',
          }}
        >
          <p className="text-xs text-gray-400 mb-1">予算残高</p>
          <p
            className="text-2xl font-bold"
            style={{ color: remaining >= 0 ? '#4a7c59' : '#ef4444' }}
          >
            {remaining >= 0 ? '' : '-'}¥{Math.abs(remaining).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">使用率 {usedPercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${usedPercent}%`,
              background: usedPercent >= 90 ? '#ef4444' : '#4a7c59',
            }}
          />
        </div>
      </div>

      <ExpenseCharts byCategory={byCategory} byDate={byDate} />
    </>
  )
}
```

- [ ] **Step 2: TypeScript 型チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add components/ExpenseDashboard.tsx
git commit -m "feat: add ExpenseDashboard client component with localStorage integration"
```

---

### Task 4: `app/expenses/add/page.tsx` の作成

**Files:**
- Create: `app/expenses/add/page.tsx`（ディレクトリも新規作成）

- [ ] **Step 1: ディレクトリを作成して `app/expenses/add/page.tsx` を作成**

```tsx
'use client'

import { type FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { type Expense, type ExpenseCategory, CATEGORIES } from '../../../lib/expenses'
import { addLocalExpense } from '../../../lib/localExpenses'

export default function AddExpensePage() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')

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

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2'
  const focusStyle = { '--tw-ring-color': '#4a7c59' } as React.CSSProperties

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 戻る
        </Link>
        <h1 className="text-lg font-bold" style={{ color: '#4a7c59' }}>
          費用を入力
        </h1>
        <div className="w-12" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 日付 */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">日付</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            style={focusStyle}
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">カテゴリ</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
            style={focusStyle}
          >
            <option value="" disabled>選択してください</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* 金額 */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">金額 (¥)</label>
          <input
            type="number"
            required
            min="1"
            step="1"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            style={focusStyle}
          />
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">メモ（任意）</label>
          <input
            type="text"
            placeholder="例: カフェでランチ"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className={inputClass}
            style={focusStyle}
          />
        </div>

        {/* 保存ボタン */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white mt-6"
          style={{ background: '#4a7c59' }}
        >
          保存する
        </button>
      </form>
    </main>
  )
}
```

- [ ] **Step 2: TypeScript 型チェック**

```bash
cd /Users/kanna/tabilog && npx tsc --noEmit
```

Expected: エラーなし

- [ ] **Step 3: コミット**

```bash
git add app/expenses/add/page.tsx
git commit -m "feat: add expense input form page"
```

---

### Task 5: `app/page.tsx` の更新

**Files:**
- Modify: `app/page.tsx`

現在の `app/page.tsx` にはサマリーカード・プログレスバー・ExpenseCharts が直接書かれている。これを `<ExpenseDashboard />` に置き換え、VisitMap セクションはそのまま維持する。

- [ ] **Step 1: `app/page.tsx` を読み込んで現在の内容を確認**

```bash
cat /Users/kanna/tabilog/app/page.tsx
```

- [ ] **Step 2: `app/page.tsx` を以下の内容で完全に書き換える**

```tsx
import ExpenseDashboard from '../components/ExpenseDashboard'
import VisitMapWrapper from '../components/VisitMapWrapper'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#4a7c59' }}>
          tabilog
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
          旅の費用トラッキング
        </p>
      </header>

      <ExpenseDashboard />

      {/* Visit map */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
          訪問した場所
        </h2>
        <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <VisitMapWrapper />
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 3: ビルド確認**

```bash
cd /Users/kanna/tabilog && npm run build
```

Expected: `✓ Compiled successfully` — エラーなし

もし `getTotalSpent()` 等の引数なし呼び出しエラーが出た場合は `lib/expenses.ts` の Task 1 変更が正しく適用されているか確認。

- [ ] **Step 4: コミット**

```bash
git add app/page.tsx
git commit -m "feat: replace inline dashboard with ExpenseDashboard component"
```

---

### Task 6: Vercel へデプロイ

**Files:**
- なし（push のみ）

- [ ] **Step 1: 最終ビルド確認**

```bash
cd /Users/kanna/tabilog && npm run build
```

Expected: エラーなし、警告のみ許容

- [ ] **Step 2: origin/main へプッシュ**

```bash
git push origin main
```

Expected: Vercel が自動デプロイを開始する
