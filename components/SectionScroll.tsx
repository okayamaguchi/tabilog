'use client'

import { useEffect, useRef } from 'react'

export default function SectionScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const lockRef = useRef(false)
  const touchYRef = useRef(0)
  const touchHandledRef = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function getVisibleSections() {
      const all = el!.querySelectorAll(':scope > main > section')
      // filter out hidden sections (display:none etc)
      return Array.from(all).filter(
        (s) => (s as HTMLElement).offsetHeight > 0
      ) as HTMLElement[]
    }

    function goTo(index: number) {
      const sections = getVisibleSections()
      if (lockRef.current || index < 0 || index >= sections.length) return
      if (index === currentRef.current) return

      lockRef.current = true
      currentRef.current = index

      const target = sections[index]
      const start = el!.scrollTop
      const end = target.offsetTop
      const dist = end - start
      const dur = 800
      let t0: number | null = null

      function step(ts: number) {
        if (t0 === null) t0 = ts
        const elapsed = ts - t0
        const p = Math.min(elapsed / dur, 1)
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
        el!.scrollTop = start + dist * ease
        if (p < 1) {
          requestAnimationFrame(step)
        } else {
          setTimeout(() => { lockRef.current = false }, 200)
        }
      }

      requestAnimationFrame(step)
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      if (lockRef.current) return
      // accumulate small deltas – only act on meaningful ones
      if (Math.abs(e.deltaY) < 5) return
      goTo(currentRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    function onTouchStart(e: TouchEvent) {
      touchYRef.current = e.touches[0].clientY
      touchHandledRef.current = false
    }

    function onTouchMove(e: TouchEvent) {
      if (lockRef.current || touchHandledRef.current) return
      const diff = touchYRef.current - e.touches[0].clientY
      if (Math.abs(diff) > 60) {
        e.preventDefault()
        touchHandledRef.current = true
        goTo(currentRef.current + (diff > 0 ? 1 : -1))
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="h-screen overflow-hidden">
      {children}
    </div>
  )
}
