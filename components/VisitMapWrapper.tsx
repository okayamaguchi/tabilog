'use client'

import dynamic from 'next/dynamic'

const VisitMap = dynamic(() => import('./VisitMap'), { ssr: false })

export default function VisitMapWrapper() {
  return <VisitMap />
}
