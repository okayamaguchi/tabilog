import { NextResponse } from 'next/server'
import { addNews } from '../../../lib/news'

export async function POST(request: Request) {
  try {
    const { title, date } = await request.json()

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 })
    }

    await addNews(title, date)
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
