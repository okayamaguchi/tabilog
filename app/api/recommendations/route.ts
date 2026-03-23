import { NextResponse } from 'next/server'
import { addRecommendation } from '../../../lib/recommendations'

export async function POST(request: Request) {
  try {
    const { city, country, reason, name } = await request.json()

    if (!city || !reason) {
      return NextResponse.json({ error: 'City and reason are required' }, { status: 400 })
    }

    await addRecommendation(city, country ?? '', reason, name ?? '')
    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
