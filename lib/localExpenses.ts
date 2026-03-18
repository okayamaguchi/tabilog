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
