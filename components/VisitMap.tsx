'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Visit } from '../lib/visits'

// カスタムアイコン設定
const customIcon = L.icon({
  iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function ClickableMarker({ visit }: { visit: Visit }) {
  return (
    <Marker
      position={[visit.lat, visit.lng]}
      icon={customIcon}
    >
      <Popup>
        <strong>{visit.city}</strong>
        <br />
        {visit.date}
        <br />
        <a href={`/gallery?city=${visit.city}`}>📸 Photos</a>
      </Popup>
    </Marker>
  )
}

export default function VisitMap({ visits }: { visits: Visit[] }) {
  const center: [number, number] = visits.length > 0
    ? [visits[0].lat, visits[0].lng]
    : [51.5074, -0.1278]

  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {visits.map((visit) => (
        <ClickableMarker key={visit.id} visit={visit} />
      ))}
    </MapContainer>
  )
}
