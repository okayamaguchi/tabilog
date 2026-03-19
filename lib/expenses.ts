export type ExpenseCategory =
  | 'Transport'
  | 'Stay'
  | 'Food'
  | 'Tours'
  | 'Shopping'
  | 'Other'

export const CATEGORIES: ExpenseCategory[] = [
  'Transport', 'Stay', 'Food', 'Tours', 'Shopping', 'Other',
]

export type Expense = {
  id: string
  date: string
  category: ExpenseCategory
  amount: number
  memo: string
}

export const BUDGET = 2_000_000

export const expenses: Expense[] = [
  { id: '1',  date: '2026-01-05', category: 'Transport',  amount: 85000,  memo: '成田→リスボン 航空券' },
  { id: '2',  date: '2026-01-05', category: 'Stay',       amount: 12000,  memo: 'リスボン ホテル 1泊目' },
  { id: '3',  date: '2026-01-06', category: 'Food',       amount: 3200,   memo: 'バカリャウとワイン' },
  { id: '4',  date: '2026-01-06', category: 'Tours',      amount: 2500,   memo: 'トラム28号線+入場料' },
  { id: '5',  date: '2026-01-07', category: 'Stay',       amount: 12000,  memo: 'リスボン ホテル 2泊目' },
  { id: '6',  date: '2026-01-07', category: 'Food',       amount: 4800,   memo: 'ファドレストラン' },
  { id: '7',  date: '2026-01-08', category: 'Shopping',   amount: 15000,  memo: 'アズレージョタイル' },
  { id: '8',  date: '2026-01-08', category: 'Food',       amount: 2100,   memo: 'パステル・デ・ナタ など' },
  { id: '9',  date: '2026-01-09', category: 'Transport',  amount: 18000,  memo: 'リスボン→マドリード バス' },
  { id: '10', date: '2026-01-09', category: 'Other',      amount: 5000,   memo: '海外旅行保険 追加' },
  { id: '11', date: '2026-01-15', category: 'Transport',  amount: 12000,  memo: '新幹線 東京→京都' },
  { id: '12', date: '2026-01-15', category: 'Stay',       amount: 22000,  memo: '京都 町家旅館 1泊' },
  { id: '13', date: '2026-01-16', category: 'Tours',      amount: 3000,   memo: '嵐山 竹林・天龍寺' },
  { id: '14', date: '2026-01-16', category: 'Food',       amount: 6500,   memo: '懐石ランチ' },
  { id: '15', date: '2026-01-17', category: 'Shopping',   amount: 28000,  memo: '西陣織 ストール' },
  { id: '16', date: '2026-01-17', category: 'Food',       amount: 3800,   memo: '抹茶スイーツ巡り' },
  { id: '17', date: '2026-02-01', category: 'Transport',  amount: 95000,  memo: '成田→カサブランカ 航空券' },
  { id: '18', date: '2026-02-01', category: 'Stay',       amount: 9500,   memo: 'マラケシュ リヤド 1泊' },
  { id: '19', date: '2026-02-02', category: 'Tours',      amount: 4000,   memo: 'タンネリ見学・ガイド料' },
  { id: '20', date: '2026-02-02', category: 'Food',       amount: 2800,   memo: 'タジン＆ミントティー' },
  { id: '21', date: '2026-02-03', category: 'Stay',       amount: 9500,   memo: 'マラケシュ リヤド 2泊' },
  { id: '22', date: '2026-02-03', category: 'Shopping',   amount: 32000,  memo: 'スーク スパイス・革製品' },
  { id: '23', date: '2026-02-04', category: 'Food',       amount: 3500,   memo: 'ジャマ・エル・フナ 屋台' },
  { id: '24', date: '2026-02-04', category: 'Transport',  amount: 8000,   memo: 'マラケシュ→マドリード 乗継' },
  { id: '25', date: '2026-02-10', category: 'Other',      amount: 12000,  memo: 'SIMカード・Wi-Fi 2か月分' },
  { id: '26', date: '2026-02-20', category: 'Transport',  amount: 120000, memo: '成田→サンティアゴ 往復' },
  { id: '27', date: '2026-02-20', category: 'Stay',       amount: 18000,  memo: 'プエルト・ナタレス 宿 1泊' },
  { id: '28', date: '2026-02-21', category: 'Tours',      amount: 25000,  memo: 'トレス・デル・パイネ 入園料+ガイド' },
  { id: '29', date: '2026-02-21', category: 'Food',       amount: 5500,   memo: 'ロッジ夕食' },
  { id: '30', date: '2026-02-22', category: 'Stay',       amount: 18000,  memo: 'パタゴニア ロッジ 2泊目' },
  { id: '31', date: '2026-02-22', category: 'Food',       amount: 4200,   memo: 'ランチ＆行動食' },
  { id: '32', date: '2026-02-23', category: 'Shopping',   amount: 20000,  memo: 'パタゴニアグッズ' },
  { id: '33', date: '2026-03-05', category: 'Transport',  amount: 78000,  memo: '成田→ダナン 往復' },
  { id: '34', date: '2026-03-05', category: 'Stay',       amount: 8000,   memo: 'ホイアン ゲストハウス 1泊' },
  { id: '35', date: '2026-03-06', category: 'Tours',      amount: 3500,   memo: 'ランタン購入・旧市街ツアー' },
  { id: '36', date: '2026-03-06', category: 'Food',       amount: 2200,   memo: 'カオラウ＆バインミー' },
  { id: '37', date: '2026-03-07', category: 'Shopping',   amount: 35000,  memo: 'アオザイ オーダーメイド' },
  { id: '38', date: '2026-03-07', category: 'Food',       amount: 1800,   memo: 'ローカル朝食' },
  { id: '39', date: '2026-03-08', category: 'Stay',       amount: 8000,   memo: 'ホイアン ゲストハウス 2泊目' },
  { id: '40', date: '2026-03-08', category: 'Other',      amount: 6500,   memo: 'ビザ申請費用' },
]

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
