'use client'

import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { visits } from '../lib/visits'

const markerIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#4a7c59;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
})

export default function VisitMap() {
  return (
    <MapContainer
      center={[47, 10]}
      zoom={4}
      style={{ height: '400px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {visits.map((v) => (
        <Marker key={v.id} position={[v.lat, v.lng]} icon={markerIcon}>
          <Popup>
            <p style={{ fontWeight: 600, color: '#4a7c59', margin: '0 0 2px' }}>{v.city}</p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>{v.date}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
