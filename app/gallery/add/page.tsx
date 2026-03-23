'use client'

import { type FormEvent, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'
// heic2any is imported dynamically to avoid SSR window error

const CITIES = ['Rome', 'Florence', 'Venice', 'Panzano', 'Warsaw']

function isHeic(file: File): boolean {
  const name = file.name.toLowerCase()
  return name.endsWith('.heic') || name.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif'
}

export default function AddPhotoPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const today = new Date().toISOString().split('T')[0]

  const [title, setTitle] = useState('')
  const [city, setCity] = useState('')
  const [date, setDate] = useState(today)
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [converting, setConverting] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return

    if (isHeic(f)) {
      setConverting(true)
      setPreview(null)
      try {
        const heic2any = (await import('heic2any')).default
        const blob = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.85 }) as Blob
        const converted = new File([blob], f.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), { type: 'image/jpeg' })
        setFile(converted)
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result as string)
        reader.readAsDataURL(converted)
      } catch {
        alert('画像の変換に失敗しました')
      } finally {
        setConverting(false)
      }
    } else {
      setFile(f)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('画像を選択してください')
      return
    }
    if (!city) {
      alert('都市を選択してください')
      return
    }
    setSaving(true)

    try {
      // 1. Upload image to ImgBB
      const uploadForm = new FormData()
      uploadForm.append('image', file)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      })

      if (!uploadRes.ok) throw new Error('Image upload failed')
      const { url: imageUrl } = await uploadRes.json()

      // 2. Save to Notion
      const saveRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, city, date, note, imageUrl }),
      })

      if (!saveRes.ok) throw new Error('Save failed')
      router.push('/gallery')
    } catch {
      alert('保存に失敗しました。もう一度お試しください。')
      setSaving(false)
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a7c59]/40 focus:border-[#4a7c59]'

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-lg font-bold mb-8" style={{ color: '#4a7c59' }}>
          📸 写真を追加
        </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">画像 *</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {converting ? (
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              画像を変換中...
            </div>
          ) : preview ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl overflow-hidden border border-gray-200"
            >
              <img src={preview} alt="preview" className="w-full h-48 object-cover" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm hover:border-[#4a7c59] hover:text-[#4a7c59] transition-colors"
            >
              タップして画像を選択
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">タイトル *</label>
          <input
            type="text"
            required
            placeholder="例: コロッセオ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">都市</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          >
            <option value="">選択してください</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">日付 *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            メモ <span className="text-gray-400">(任意)</span>
          </label>
          <textarea
            placeholder="例: 夕暮れ時がきれいだった"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/gallery"
            className="flex-1 py-3 rounded-xl font-medium text-sm text-center border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl font-medium text-white text-sm disabled:opacity-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #4a7c59, #6ab87a)',
              boxShadow: '0 2px 10px rgba(74, 124, 89, 0.3)',
            }}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
      </main>
    </>
  )
}
