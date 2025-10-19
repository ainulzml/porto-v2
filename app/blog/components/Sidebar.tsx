import Link from 'next/link'

export default function Sidebar({ categories, recent }: { categories: { category: string; count: number }[]; recent: { title: string; slug: string }[] }) {
  return (
    <aside className="space-y-6">
      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-3">Kategori</h3>
        <div className="grid gap-2">
          {categories.map(c => (
            <Link key={c.category} href={`/blog/categories/${encodeURIComponent(c.category)}`} className="flex justify-between text-sm px-2 py-1 hover:bg-gray-50 rounded">
              <span>{c.category}</span>
              <span className="text-gray-500">{c.count}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-4 border rounded">
        <h3 className="font-semibold mb-3">Terbaru</h3>
        <ul className="space-y-2">
          {recent.map(r => (
            <li key={r.slug}>
              <Link href={`/blog/${r.slug}`} className="text-sm text-sky-600 hover:underline">{r.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
