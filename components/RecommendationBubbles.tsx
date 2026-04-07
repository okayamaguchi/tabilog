'use client'

import type { Recommendation } from '../lib/recommendations'

export default function RecommendationBubbles({
  recommendations,
}: {
  recommendations: Recommendation[]
}) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full">
      {recommendations.map((rec, index) => {
        const isLeft = index % 2 === 0
        return (
          <div
            key={index}
            className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`relative max-w-xs px-4 py-3 rounded-2xl shadow-lg ${
                isLeft
                  ? 'bg-white text-gray-800 rounded-bl-none'
                  : 'bg-[#4a7c59] text-white rounded-br-none'
              }`}
            >
              <p className="text-xs opacity-70 mb-1">{rec.name}さん</p>
              <p className="font-bold text-sm">
                {rec.city}
                {rec.country && ` (${rec.country})`}
              </p>
              {rec.reason && (
                <p className="text-xs mt-1 opacity-90 whitespace-pre-wrap">{rec.reason}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
