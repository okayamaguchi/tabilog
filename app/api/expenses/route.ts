import { NextResponse } from 'next/server'
import { addExpense } from '../../../lib/expenses'

export async function POST(request: Request) {
  try {
    const { date, category, amount, memo } = await request.json()

    if (!date || !category || !amount) {
      return NextResponse.json({ error: 'Date, category, and amount are required' }, { status: 400 })
    }

    await addExpense(date, category, Number(amount), memo ?? '')
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
