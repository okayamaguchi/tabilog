'use client'

import { useEffect, useState } from 'react'

const COUNTRY_CONFIG: Record<string, { flag: string; timezone: string }> = {
  Italy: { flag: '🇮🇹', timezone: 'Europe/Rome' },
  France: { flag: '🇫🇷', timezone: 'Europe/Paris' },
  Spain: { flag: '🇪🇸', timezone: 'Europe/Madrid' },
  Germany: { flag: '🇩🇪', timezone: 'Europe/Berlin' },
  UK: { flag: '🇬🇧', timezone: 'Europe/London' },
  Netherlands: { flag: '🇳🇱', timezone: 'Europe/Amsterdam' },
  Greece: { flag: '🇬🇷', timezone: 'Europe/Athens' },
  Switzerland: { flag: '🇨🇭', timezone: 'Europe/Zurich' },
  Portugal: { flag: '🇵🇹', timezone: 'Europe/Lisbon' },
  Austria: { flag: '🇦🇹', timezone: 'Europe/Vienna' },
  Czech: { flag: '🇨🇿', timezone: 'Europe/Prague' },
  Poland: { flag: '🇵🇱', timezone: 'Europe/Warsaw' },
  Croatia: { flag: '🇭🇷', timezone: 'Europe/Zagreb' },
  Turkey: { flag: '🇹🇷', timezone: 'Europe/Istanbul' },
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatClock(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const month = Number(parts.find(p => p.type === 'month')?.value ?? 1) - 1
  const day = parts.find(p => p.type === 'day')?.value ?? ''
  const hour = parts.find(p => p.type === 'hour')?.value ?? ''
  const minute = parts.find(p => p.type === 'minute')?.value ?? ''

  return `${MONTHS[month]} ${day} ${hour}:${minute}`
}

const pillStyle = {
  background: '#FFFFFF',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
}

export default function DualClock() {
  const [now, setNow] = useState<Date | null>(null)
  const [country, setCountry] = useState('Poland')

  useEffect(() => {
    const saved = localStorage.getItem('currentCountry')
    if (saved && COUNTRY_CONFIG[saved]) setCountry(saved)

    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  const config = COUNTRY_CONFIG[country]
  const jp = formatClock(now, 'Asia/Tokyo')
  const local = formatClock(now, config.timezone)

  return (
    <div className="flex items-center gap-3">
      <div
        className="rounded-full px-4 py-2 text-sm text-gray-600 whitespace-nowrap"
        style={pillStyle}
      >
        🇯🇵 {jp}
      </div>
      <div
        className="rounded-full px-4 py-2 text-sm text-gray-600 whitespace-nowrap"
        style={pillStyle}
      >
        {config.flag} {local}
      </div>
    </div>
  )
}
