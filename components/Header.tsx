'use client'

import { useState } from 'react'
import Link from 'next/link'
import DualClock from './DualClock'
import SnsLinks from './SnsLinks'

function getDayNumber() {
  const departure = new Date('2026-03-07T00:00:00+09:00')
  const now = new Date()
  const diff = now.getTime() - departure.getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const MENU_ITEMS = [
  { label: '📢 お知らせ', id: 'news' },
  { label: '📸 記録', id: 'photos' },
  { label: '📍 旅路', id: 'places' },
  { label: '💰 予算', id: 'budget' },
]


export default function Header({ showClock = false }: { showClock?: boolean }) {
  const day = getDayNumber()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)

  const closeMenu = () => {
    setMenuClosing(true)
    setTimeout(() => {
      setMenuOpen(false)
      setMenuClosing(false)
    }, 200)
  }

  const handleMenuClick = (id: string) => {
    closeMenu()
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 220)
  }

  return (
    <>
      {/* tabilog card - always on top */}
      <Link
        href="/"
        className="fixed top-4 left-4 md:left-8 z-[300] rounded-2xl px-5 py-4 flex flex-col items-start hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          boxShadow: '0 4px 16px rgba(74, 124, 89, 0.15)',
        }}
      >
        <span className="text-xl md:text-2xl font-bold leading-tight" style={{ color: '#4a7c59' }}>tabilog</span>
        <span className="text-xs md:text-sm font-bold mt-0.5" style={{ color: 'rgba(74, 124, 89, 0.5)' }}>
          Day {day}
        </span>
      </Link>

      <div className="sticky top-0 z-50 w-full px-4 md:px-8 pt-4 pb-2 h-[80px] md:h-[88px]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-full">
          {/* Spacer for tabilog card */}
          <div className="w-[120px] md:w-[140px]" />

          {/* Desktop: clock */}
          {showClock && (
            <div className="hidden md:block">
              <DualClock />
            </div>
          )}

          {/* Mobile: hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[6px] p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
          >
            <span className="block w-6 h-[3px] rounded-full" style={{ background: '#4a7c59' }} />
            <span className="block w-6 h-[3px] rounded-full" style={{ background: '#4a7c59' }} />
          </button>
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[200] bg-white flex flex-col"
          style={{ animation: `${menuClosing ? 'fadeOut' : 'fadeIn'} 0.2s ease-out forwards` }}
        >
          {/* Close button */}
          <div className="flex justify-end p-5">
            <button
              onClick={closeMenu}
              className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-8 pt-8">
            <ul className="flex flex-col gap-6">
              {MENU_ITEMS.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => handleMenuClick(id)}
                    className="text-left text-xl font-semibold transition-opacity hover:opacity-70"
                    style={{ color: '#4a7c59' }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

          </nav>

          {/* SNS icons at bottom center */}
          <div className="flex justify-center pb-10">
            <SnsLinks />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </>
  )
}
