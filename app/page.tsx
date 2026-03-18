import Image from 'next/image'
import Link from 'next/link'
import { posts } from '../lib/posts'

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold" style={{ color: '#4a7c59' }}>
          tabilog
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
          旅の記録
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <div className="relative aspect-video">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="p-4">
              <p className="text-xs font-medium mb-1" style={{ color: '#4a7c59' }}>
                {post.location}
              </p>
              <h2 className="text-base font-bold text-gray-900 leading-snug mb-2">
                {post.title}
              </h2>
              <p className="text-xs text-gray-400">{post.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
