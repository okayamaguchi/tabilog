'use client'

import dynamic from 'next/dynamic'
import type { Visit } from '../lib/visits'

const VisitMap = dynamic(() => import('./VisitMap'), { ssr: false })

export default function VisitMapWrapper({ visits }: { visits: Visit[] }) {
  return <VisitMap visits={visits} />
}
