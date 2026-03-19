import Image from 'next/image'
import Link from 'next/link'
import { posts } from '../lib/posts'

export default function DiarySection() {
  const [featured, ...rest] = posts
  const small = rest.slice(0, 4)

  if (!featured) return null

  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold mb-4" style={{ color: '#4a7c59' }}>
        ✈️ Diary
      </h2>

      {/* 左: Featured大カード / 右: 小カード2×2グリッド */}
      <div className="flex gap-3 items-stretch">
        {/* 左: Featured */}
        <Link href={`/posts/${featured.id}`} className="block group w-1/2 flex-shrink-0">
          <div className="relative rounded-[32px] overflow-hidden h-full min-h-[300px]">
            <Image
              src={featured.thumbnail}
              alt={featured.title}
              fill
              className="object-cover transition-[filter] duration-300 group-hover:brightness-75"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 -rotate-2"
                style={{
                  background: 'white',
                  color: '#4a7c59',
                  border: '3px solid #4a7c59',
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.18)',
                }}
              >
                ✈️ Latest
              </span>
              <p className="text-white font-bold text-lg leading-snug">
                {featured.title}
              </p>
              <p className="text-white/70 text-xs mt-1">
                {featured.location} · {featured.date}
              </p>
            </div>
          </div>
        </Link>

        {/* 右: 小カード 2×2 */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {small.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`} className="block group">
              <div className="relative rounded-[32px] overflow-hidden h-full min-h-[140px]">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover transition-[filter] duration-300 group-hover:brightness-75"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3">
                  <p className="text-white font-semibold text-sm leading-snug line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-white/70 text-xs mt-0.5">{post.location} · {post.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
