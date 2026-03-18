# 訪問マップ機能 設計仕様

**日付**: 2026-03-18
**ステータス**: 承認済み

---

## 概要

TOPページ（`app/page.tsx`）の費用ダッシュボード下に「訪問した場所」セクションを追加する。react-leaflet を使い、訪問都市をマーカー表示。マーカークリックで都市名・訪問日を表示する。

---

## アーキテクチャ

### 新規ファイル

| ファイル | 役割 |
|---------|------|
| `lib/visits.ts` | 訪問都市モックデータ（型定義 + データ配列） |
| `components/VisitMap.tsx` | `'use client'` — react-leaflet マップコンポーネント |

### 変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| `app/page.tsx` | `VisitMap` を dynamic import（`ssr: false`）して `<ExpenseCharts />` の下に配置 |
| `package.json` | `leaflet`, `react-leaflet`, `@types/leaflet` を追加 |

### SSR 対応

react-leaflet は `window` オブジェクトを参照するため SSR 不可。`app/page.tsx`（Server Component）から `next/dynamic` で `ssr: false` を指定してインポートする。

```ts
const VisitMap = dynamic(() => import('../components/VisitMap'), { ssr: false })
```

---

## データ定義（`lib/visits.ts`）

```ts
export type Visit = {
  id: string
  city: string        // 表示名（日本語）
  lat: number
  lng: number
  date: string        // YYYY-MM-DD
}
```

### モックデータ（7都市）

expenses の旅程（成田→リスボン発）と整合させる。

| 都市 | lat | lng | 訪問日 |
|------|-----|-----|--------|
| リスボン | 38.7223 | -9.1393 | 2026-01-05 |
| ポルト | 41.1579 | -8.6291 | 2026-01-10 |
| パリ | 48.8566 | 2.3522 | 2026-01-18 |
| ダブリン | 53.3498 | -6.2603 | 2026-01-28 |
| ローマ | 41.9028 | 12.4964 | 2026-02-05 |
| フィレンツェ | 43.7696 | 11.2558 | 2026-02-12 |
| ヴェネツィア | 45.4408 | 12.3155 | 2026-02-18 |

---

## コンポーネント設計（`components/VisitMap.tsx`）

### 責務

- Leaflet CSS のインポート
- Leaflet デフォルトマーカーアイコン修正（webpack バンドル問題への対応）
- `MapContainer` + `TileLayer`（OpenStreetMap）
- 各都市に `Marker` + `Popup`

### マーカー

`divIcon` でセージグリーン（`#4a7c59`）の円形カスタムマーカーを使用：

```tsx
const icon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#4a7c59;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})
```

### Popup 内容

```
ヴェネツィア
2026-02-18
```

- 都市名: `font-semibold`, セージグリーン
- 訪問日: `text-sm text-gray-500`

### 地図設定

| パラメータ | 値 |
|-----------|-----|
| center | `[47, 10]`（ヨーロッパ中央） |
| zoom | `4` |
| height | `400px` |
| scrollWheelZoom | `false` |
| tile | OpenStreetMap 標準タイル |

---

## `app/page.tsx` の変更

`<ExpenseCharts ... />` の直後に追加：

```tsx
{/* Visit map */}
<section className="mt-10">
  <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
    訪問した場所
  </h2>
  <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
    <VisitMap />
  </div>
</section>
```

---

## 依存パッケージ

```
leaflet ^1.9
react-leaflet ^4
@types/leaflet ^1.9  (devDependency)
```

---

## 考慮事項

- **Leaflet アイコン画像問題**: Next.js の webpack では `leaflet/dist/images/` のデフォルトアイコンパスが壊れる。`divIcon` を使うことで回避（画像ファイル不要）。
- **CSS インポート**: `leaflet/dist/leaflet.css` を `VisitMap.tsx` 内でインポートする（`'use client'` コンポーネント内なので問題なし）。
- **`scrollWheelZoom: false`**: ページスクロールと地図ズームの競合を防ぐ。
