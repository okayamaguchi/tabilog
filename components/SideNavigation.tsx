'use client'

const MENU_ITEMS = [
  { label: 'お知らせ', index: 1 },
  { label: '記録', index: 2 },
  { label: '旅路', index: 3 },
  { label: '予算', index: 4 },
]

export default function SideNavigation() {
  const scrollToSection = (sectionIndex: number) => {
    const container = document.querySelector('.h-screen.overflow-hidden')
    const sections = container?.querySelectorAll(':scope > main > section')
    if (sections?.[sectionIndex]) {
      const target = sections[sectionIndex] as HTMLElement
      container?.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
    }
  }

  return (
    <nav className="hidden md:block fixed left-8 top-1/2 -translate-y-1/2 z-[100]">
      <ul className="space-y-5">
        {MENU_ITEMS.map(({ label, index }) => (
          <li key={label}>
            <button
              onClick={() => scrollToSection(index)}
              className="text-sm tracking-wide text-gray-500 hover:text-gray-900 transition-colors text-left"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
