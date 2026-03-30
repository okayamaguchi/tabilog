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
  { label: 'お知らせ', index: 1 },
  { label: '記録', index: 2 },
  { label: '旅路', index: 3 },
  { label: '予算', index: 4 },
]

export default function Header() {
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

  const scrollToSection = (sectionIndex: number) => {
    closeMenu()
    setTimeout(() => {
      const container = document.querySelector('.h-screen.overflow-hidden')
      const sections = container?.querySelectorAll(':scope > main > section')
      if (sections?.[sectionIndex]) {
        const target = sections[sectionIndex] as HTMLElement
        container?.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
      }
    }, 220)
  }

  return (
    <>
      {/* tabilog card - fixed top left */}
      <Link
        href="/"
        className="fixed top-4 left-4 md:left-8 z-[300] hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5"
      >
        <div className="relative w-28 h-24 md:w-36 md:h-32">
          <img src="/okayama.svg" alt="okayama" className="w-full h-full opacity-90" />
          <div className="absolute top-[40%] md:top-[38%] left-[43%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <h1 className="text-[13px] md:text-lg font-bold text-white drop-shadow-lg tracking-wide">tabilog</h1>
            <p className="text-[10px] md:text-[11px] text-white/95 drop-shadow-md mt-[1px] md:mt-0">Day {day}</p>
          </div>
        </div>
      </Link>

      {/* Desktop: clock - fixed top right */}
      <div className="hidden md:block fixed top-4 right-8 z-[300]">
        <DualClock />
      </div>

      {/* Mobile: hamburger - fixed top right */}
      <button
        className="md:hidden fixed top-6 right-4 z-[300] flex flex-col justify-center items-center gap-[6px] p-2"
        onClick={() => setMenuOpen(true)}
        aria-label="Menu"
      >
        <span className="block w-6 h-[3px] rounded-full bg-[#4a7c59]" />
        <span className="block w-6 h-[3px] rounded-full bg-[#4a7c59]" />
      </button>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[200] bg-white flex flex-col"
          style={{ animation: `${menuClosing ? 'fadeOut' : 'fadeIn'} 0.2s ease-out forwards` }}
        >
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

          <nav className="flex-1 px-8 pt-8">
            <ul className="flex flex-col gap-6">
              {MENU_ITEMS.map(({ label, index }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollToSection(index)}
                    className="text-left text-xl font-semibold transition-opacity hover:opacity-70"
                    style={{ color: '#4a7c59' }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

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
