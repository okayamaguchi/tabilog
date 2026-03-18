export type Visit = {
  id: string
  city: string
  lat: number
  lng: number
  date: string // YYYY-MM-DD
}

export const visits: Visit[] = [
  { id: '1', city: 'リスボン',     lat: 38.7223, lng:  -9.1393, date: '2026-01-05' },
  { id: '2', city: 'ポルト',       lat: 41.1579, lng:  -8.6291, date: '2026-01-10' },
  { id: '3', city: 'パリ',         lat: 48.8566, lng:   2.3522, date: '2026-01-18' },
  { id: '4', city: 'ダブリン',     lat: 53.3498, lng:  -6.2603, date: '2026-01-28' },
  { id: '5', city: 'ローマ',       lat: 41.9028, lng:  12.4964, date: '2026-02-05' },
  { id: '6', city: 'フィレンツェ', lat: 43.7696, lng:  11.2558, date: '2026-02-12' },
  { id: '7', city: 'ヴェネツィア', lat: 45.4408, lng:  12.3155, date: '2026-02-18' },
]
