import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '../../../components/Header'
import { getPostById } from '../../../lib/posts'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: Props) {
  const { id } = await params
  const post = getPostById(id)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-10">

      <div className="relative h-[400px] rounded-xl overflow-hidden mt-4">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 672px) 100vw, 672px"
          priority
        />
      </div>

      <div className="mt-6 flex items-center gap-4 text-sm">
        <span className="font-medium" style={{ color: '#4a7c59' }}>
          {post.location}
        </span>
        <span className="text-gray-400">{post.date}</span>
      </div>

      <h1 className="mt-3 text-2xl font-bold text-gray-900 leading-snug">
        {post.title}
      </h1>

      <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
        {post.body.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      </main>
    </>
  )
}
