import Link from 'next/link'

export default function CategoryCard({ category, count }: { category: string; count: number }) {
  return (
    <Link href={`/blog/categories/${encodeURIComponent(category)}`} className="block p-4 border rounded hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">{category}</div>
        <div className="text-sm text-gray-600">{count}</div>
      </div>
    </Link>
  )
}
