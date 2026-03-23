import { notion } from './notion'

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

export async function getExpenses(): Promise<Expense[]> {
  const dsId = process.env.NOTION_EXPENSES_DB_ID
  if (!dsId) return []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await (notion.dataSources as any).query({
      data_source_id: dsId,
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (response.results ?? []).map((page: any) => {
      const props = page.properties as Record<string, any>
      return {
        id: page.id,
        date: props['Date']?.date?.start ?? '',
        category: (props['Category']?.select?.name ?? 'Other') as ExpenseCategory,
        amount: props['Amount']?.number ?? 0,
        memo: props['Memo']?.title?.[0]?.plain_text ?? '',
      }
    })
  } catch (err) {
    console.error('[expenses] Failed to fetch:', err)
    return []
  }
}

export async function addExpense(date: string, category: string, amount: number, memo: string) {
  const dsId = process.env.NOTION_EXPENSES_DB_ID
  if (!dsId) throw new Error('NOTION_EXPENSES_DB_ID is not set')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (notion as any).pages.create({
    parent: { database_id: dsId },
    properties: {
      Memo: { title: [{ text: { content: memo || 'Untitled' } }] },
      Date: { date: { start: date } },
      Category: { select: { name: category } },
      Amount: { number: amount },
    },
  })
}

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
