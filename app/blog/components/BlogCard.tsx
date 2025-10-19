import Link from 'next/link'

type Props = {
  title: string
  date?: string
  excerpt?: string
  slug: string
  category?: string | string[]
}

export default function BlogCard({ title, date, excerpt, slug, category }: Props) {
  const cats = Array.isArray(category) ? category : category ? [category] : []

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-2xl font-semibold mb-2">
        <Link href={`/blog/${slug}`} className="text-sky-600 hover:underline">
          {title}
        </Link>
      </h2>
      <div className="flex items-center gap-3 mb-3">
        {date && <div className="text-sm text-gray-500">{date}</div>}
        <div className="flex gap-2">
          {cats.map(c => (
            <Link key={c} href={`/blog/categories/${encodeURIComponent(c)}`} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {c}
            </Link>
          ))}
        </div>
      </div>
      {excerpt && <p className="text-gray-700">{excerpt}</p>}
      <div className="mt-4">
        <Link href={`/blog/${slug}`} className="text-sky-600 font-medium hover:underline">
          Baca selengkapnya →
        </Link>
      </div>
    </article>
  )
}
