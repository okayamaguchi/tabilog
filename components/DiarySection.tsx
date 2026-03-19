import Image from 'next/image'
import Link from 'next/link'
import { posts } from '../lib/posts'

export default function DiarySection() {
  const [featured, ...rest] = posts

  if (!featured) return null

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
        ✈️ Diary
      </h2>

      {/* Featured */}
      <Link href={`/posts/${featured.id}`} className="block group mb-3">
        <div className="relative rounded-[32px] overflow-hidden h-[200px] md:h-[280px]">
          <Image
            src={featured.thumbnail}
            alt={featured.title}
            fill
            className="object-cover transition-[filter] duration-300 group-hover:brightness-75"
            sizes="(max-width: 768px) 100vw, 1400px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 md:p-6">
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 -rotate-2"
              style={{
                background: 'white',
                color: '#4a7c59',
                border: '3px solid #4a7c59',
                boxShadow: '2px 2px 6px rgba(0,0,0,0.18)',
              }}
            >
              ✈️ 最新の旅
            </span>
            <p className="text-white font-bold text-base md:text-xl leading-snug">
              {featured.title}
            </p>
            <p className="text-white/70 text-xs mt-1">
              {featured.location} · {featured.date}
            </p>
          </div>
        </div>
      </Link>

      {/* Small grid: 1col mobile, 2col PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {rest.map((post) => (
          <Link key={post.id} href={`/posts/${post.id}`} className="block group">
            <div className="relative rounded-[28px] overflow-hidden h-[140px]">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover transition-[filter] duration-300 group-hover:brightness-75"
                sizes="(max-width: 768px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 p-3">
                <p className="text-white font-semibold text-sm leading-snug">
                  {post.title}
                </p>
                <p className="text-white/70 text-xs mt-0.5">{post.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
