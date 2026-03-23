import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'IMGBB_API_KEY is not set' }, { status: 500 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    const imgbbForm = new FormData()
    imgbbForm.append('key', apiKey)
    imgbbForm.append('image', base64)

    const res = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbForm,
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `ImgBB upload failed: ${text}` }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ url: data.data.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
