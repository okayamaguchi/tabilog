import { NextResponse } from 'next/server'
import { notion } from '../../../lib/notion'

export async function POST(request: Request) {
  try {
    const { title, city, date, note, imageUrl } = await request.json()

    if (!title || !date || !imageUrl) {
      return NextResponse.json({ error: 'Title, date, and image are required' }, { status: 400 })
    }

    const dbId = process.env.NOTION_PHOTO_DB_ID
    if (!dbId) {
      return NextResponse.json({ error: 'NOTION_PHOTO_DB_ID is not set' }, { status: 500 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (notion as any).pages.create({
      parent: { database_id: dbId },
      properties: {
        Title: { title: [{ text: { content: title } }] },
        City: { rich_text: [{ text: { content: city ?? '' } }] },
        Date: { date: { start: date } },
        Note: { rich_text: [{ text: { content: note ?? '' } }] },
        Photo: {
          files: [{ type: 'external', name: title, external: { url: imageUrl } }],
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
